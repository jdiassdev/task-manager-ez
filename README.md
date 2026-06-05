# Task Manager

Aplicação full-stack de gerenciamento de tarefas feita como teste técnico.

**Backend:** Laravel 12, PHP 8.3, SQLite, PHPUnit  
**Frontend:** Vue 3, TypeScript, Pinia, Vue Router, Tailwind CSS 4, Vitest

## Instalação

Requisitos: PHP >= 8.2 com Composer e Node.js >= 18.

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
npm install
```

Para rodar a aplicação, abra dois terminais:

```bash
# Terminal 1: API Laravel
php artisan serve

# Terminal 2: Frontend (Vite)
npm run dev
```

Acesse em `http://localhost:8000`.

O banco de dados é SQLite, então nenhuma configuração adicional é necessária. O arquivo é criado automaticamente em `database/database.sqlite` quando você rodar as migrações. Se quiser usar MySQL, edite `DB_CONNECTION` e as variáveis `DB_*` no `.env`.

## Estrutura

```
├── app/
│   ├── Enums/              # ProjectStatus, TaskStatus, TaskPriority
│   ├── Http/
│   │   ├── Controllers/    # ProjectController, TaskController
│   │   ├── Requests/       # Validação (Store, Update, Filter)
│   │   └── Resources/      # BaseResource, ProjectResource, TaskResource
│   └── Models/             # Project, Task
├── resources/js/
│   ├── components/         # AppLayout, TaskCard, ProjectCard, modais
│   ├── composables/        # useTask, useProjects, useToast
│   ├── stores/             # Pinia (tasks, projects)
│   ├── views/              # ProjectList, ProjectDetail
│   └── __tests__/          # Vitest
└── routes/
    ├── api.php
    └── web.php
```

## API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar projetos com contagem de tarefas |
| POST | `/api/projects` | Criar projeto |
| PATCH | `/api/projects/{id}` | Arquivar ou restaurar projeto |
| GET | `/api/projects/{id}/tasks` | Listar tarefas (paginado, filtrável) |
| POST | `/api/projects/{id}/tasks` | Criar tarefa |
| PATCH | `/api/tasks/{id}` | Atualizar status ou prioridade |
| DELETE | `/api/tasks/{id}` | Excluir tarefa (retorna 204) |

### Filtros disponíveis em `GET /api/projects/{id}/tasks`

| Parâmetro | Exemplo | Valores aceitos |
|-----------|---------|-----------------|
| `status` | `?status=todo` | `todo`, `in_progress`, `done` |
| `priority` | `?priority=high` | `low`, `medium`, `high` |
| `overdue` | `?overdue=1` | `1` ou `0` |
| `due_date` | `?due_date=2026-06-10` | Formato `Y-m-d` |
| `cursor` | `?cursor=xxx` | Cursor retornado pela API |

### Formato de resposta

```json
{
  "message": "Projeto criado com sucesso.",
  "code": 201,
  "data": { "id": 1, "name": "...", "status": "active", "tasks_count": 0 }
}
```

Listas de tarefas incluem `meta` com `next_cursor` e `prev_cursor` para navegação. Erros de validação retornam `422` com o campo `errors`. Exclusão retorna `204` sem corpo.

## Testes

```bash
# Backend (PHPUnit)
php vendor/bin/phpunit

# Frontend (Vitest)
npm test
```

Os testes de backend cobrem os endpoints de projetos e tarefas: listagem, criação, validação, filtros, atualização de status e soft delete.

Os testes de frontend cobrem `useTask` (carregamento, filtros, paginação com cursor, optimistic update com reversão automática, exclusão) e `useToast` (criação, tipos, dismiss manual e auto-dismiss por timeout).

## Decisões técnicas

**SQLite por pragmatismo:** sem necessidade de configurar servidor de banco de dados; o foco do projeto é o código, não a infra.

**Enums PHP nativos:** `ProjectStatus`, `TaskStatus` e `TaskPriority` são backed enums com cast direto no model; valores inválidos são rejeitados antes de chegar ao banco.

**Envelope de resposta `{ message, code, data }`:** formato uniforme em todos os endpoints para que o cliente saiba sempre onde estão os dados, a mensagem e o código.

**`BaseResource` com `only()`:** um único resource serve contextos diferentes (lista vs detalhe) sem duplicar classes.

**`FilterTaskRequest` em endpoint GET:** Form Request em endpoint de leitura mantém a validação centralizada e o controller limpo.

**`Route::fallback` para SPA:** só ativa quando nenhuma outra rota Laravel corresponde, sem depender da ordem de declaração.

**PHPUnit:** testes de feature com `RefreshDatabase` e SQLite em memória (`:memory:`); cada teste roda isolado sem persistência entre casos.

**Cursor pagination:** `cursorPaginate(20)` em vez de offset; evita `COUNT(*)` e mantém resultados estáveis mesmo que tarefas sejam criadas ou excluídas durante a navegação. Num task manager raramente se ultrapassa 2 páginas, o que torna o cursor ideal sem precisar saber o total de páginas.

**`useToast` com `ref` de módulo:** `ref` declarado fora da função torna o composable um singleton sem precisar de store Pinia; `ToastContainer` usa `Teleport to="body"` para evitar problemas de `z-index`.

**Tarefas concluídas ordenadas para o fim:** `computed` que empurra `status === 'done'` para o final; como o optimistic update é imediato, o `TransitionGroup` anima o reordenamento.

**Debounce nos filtros de tarefa:** `watch(filters, ...)` aguarda 300 ms antes de disparar a requisição, evitando chamadas desnecessárias à API.

**Filtragem de projetos no frontend:** `GET /api/projects` retorna todos os projetos de uma vez (`->get()`); filtrar no backend exigiria uma requisição por tab para dados já em memória. Aceitável para o volume esperado; em escala justificaria mover o filtro para a API.

**SELECT explícito nas queries:** todos os endpoints usam `->select([...])` com as colunas estritamente necessárias em vez de `SELECT *`. Evita trazer dados que o resource vai descartar e reduz o volume transferido entre banco e aplicação.

**Índices compostos em `tasks`:** quatro índices criados com base nas queries reais do log: `(project_id, deleted_at)` como base de toda listagem, mais três variantes com `status`, `priority` e `due_date` para cobrir os filtros disponíveis. `project_id` vem primeiro em todos porque é a coluna de maior seletividade.

**Arquivar projeto e filtro de estado (fora do spec):** o modelo já tinha `ProjectStatus` com `active`/`archived` e os scopes; o endpoint era a peça que faltava. O filtro é a consequência direta: sem ele, arquivados se misturam com os ativos.
