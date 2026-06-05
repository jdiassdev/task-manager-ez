# Task Manager

Aplicação full-stack de gestão de tarefas construída como teste técnico.

**Backend** — Laravel 12 · PHP 8.3 · SQLite · Pest  
**Frontend** — Vue 3 · TypeScript · Pinia · Vue Router · Tailwind CSS 4 · Vitest

---

## Instalação

### Requisitos

- PHP >= 8.2 + Composer
- Node.js >= 18

### Passos

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
npm install
```

### Correr

```bash
# Terminal 1 — API Laravel
php artisan serve

# Terminal 2 — Frontend (Vite)
npm run dev
```

Aceder em `http://localhost:8000`.

> A base de dados é SQLite — não é necessária nenhuma configuração adicional. O ficheiro é criado automaticamente em `database/database.sqlite` ao correr as migrações. Para usar MySQL, editar `DB_CONNECTION` e as variáveis `DB_*` no `.env`.

---

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

---

## API

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar projetos com contagem de tarefas |
| POST | `/api/projects` | Criar projeto |
| PATCH | `/api/projects/{id}` | Arquivar ou restaurar projeto |
| GET | `/api/projects/{id}/tasks` | Listar tarefas (paginado, filtrável) |
| POST | `/api/projects/{id}/tasks` | Criar tarefa |
| PATCH | `/api/tasks/{id}` | Atualizar status ou prioridade |
| DELETE | `/api/tasks/{id}` | Eliminar tarefa |

### Filtros — `GET /api/projects/{id}/tasks`

| Parâmetro | Exemplo | Valores aceites |
|-----------|---------|-----------------|
| `status` | `?status=todo` | `todo` · `in_progress` · `done` |
| `priority` | `?priority=high` | `low` · `medium` · `high` |
| `overdue` | `?overdue=1` | `1` ou `0` |
| `due_date` | `?due_date=2026-06-10` | Formato `Y-m-d` |

### Formato de resposta

```json
{
  "message": "Projeto criado com sucesso.",
  "code": 201,
  "data": { "id": 1, "name": "...", "status": "active", "tasks_count": 0 }
}
```

Listas incluem `meta` e `links` com cursor de paginação. Erros de validação devolvem `422` com campo `errors`.

---

## Testes

```bash
# Backend
php vendor/bin/pest

# Frontend
npm test
```

Os testes de frontend cobrem `useTask` (carregamento, filtros, optimistic update com reversão automática, eliminação) e `useToast` (criação, tipos, dismiss manual e auto-dismiss por timeout).

---

## Decisões técnicas

**SQLite por pragmatismo** — sem necessidade de configurar servidor de BD; o foco do projeto é o código, não a infra.

**Enums PHP nativos** — `ProjectStatus`, `TaskStatus` e `TaskPriority` são backed enums com cast direto no model; valores inválidos são rejeitados antes de chegar à BD.

**Envelope de resposta `{ message, code, data }`** — formato uniforme em todos os endpoints para que o cliente saiba sempre onde estão os dados, a mensagem e o código.

**`BaseResource` com `only()`** — um único resource serve contextos diferentes (lista vs detalhe) sem duplicar classes.

**`FilterTaskRequest` em endpoint GET** — Form Request em endpoint de leitura mantém a validação centralizada e o controller limpo.

**`Route::fallback` para SPA** — só ativa quando nenhuma outra rota Laravel corresponde, sem depender da ordem de declaração.

**Pest em vez de PHPUnit direto** — construído sobre PHPUnit (satisfaz o requisito), com sintaxe mais legível.

**Pinia com stores singleton** — as stores são instâncias únicas partilhadas por toda a app; componentes não relacionados leem e escrevem no mesmo estado sem passar props.

**Composables como camada de serviço** — `useTask` e `useProjects` encapsulam pedidos HTTP, estado e toasts; os componentes chamam funções com nomes de negócio sem conhecer detalhes de implementação.

**`useToast` com `ref` de módulo** — `ref` declarado fora da função torna o composable um singleton sem precisar de store Pinia; `ToastContainer` usa `Teleport to="body"` para evitar problemas de `z-index`.

**Optimistic update em `updateTask`** — status atualizado no store antes da API responder; se falhar, o estado anterior é restaurado e um toast de erro é exibido.

**Tarefas concluídas ordenadas para o fim** — `computed` que empurra `status === 'done'` para o final; como o optimistic update é imediato, o `TransitionGroup` anima o reordenamento.

**Debounce nos filtros de tarefa** — `watch(filters, ...)` aguarda 300 ms antes de disparar o pedido, evitando chamadas desnecessárias à API.

**Filtragem de projetos no frontend** — `GET /api/projects` já devolve todos os projetos; filtrar no backend exigiria um pedido por tab para dados já em memória. Aceitável para o volume esperado; a escala justificaria mover o filtro para a API.

**Arquivar projeto e filtro de estado (fora do spec)** — o modelo já tinha `ProjectStatus` com `active`/`archived` e os scopes; o endpoint era a peça que faltava. O filtro é a consequência direta: sem ele, arquivados misturam-se com os ativos.

---

## O que ficou por implementar

**Autenticação** — a API não tem autenticação; todos os dados são globais. Num produto real cada utilizador teria os seus próprios recursos. Ficou de fora por não ser pedido no enunciado e para não aumentar a complexidade do setup.

**"Carregar mais" na lista de tarefas** — o backend usa cursor pagination e devolve as primeiras 20 tarefas. O frontend não implementa paginação incremental; apenas a primeira página é apresentada.

**Edição de tarefa** — após criação, só é possível alterar status e prioridade. Título, descrição e data limite não são editáveis. A API suporta `PATCH /api/tasks/{id}` mas o frontend não tem UI para estes campos.

**Edição de projeto** — nome e descrição não são editáveis após criação, pelo mesmo motivo.

**Vista Kanban** — seria a adição de maior valor para um task manager (colunas por status: A fazer · Em progresso · Concluído), mas ficou fora do scope do teste.
