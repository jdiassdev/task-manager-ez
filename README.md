# Task Manager

API RESTful em Laravel 12 com SPA Vue 3 + Tailwind 4 integrada via Vite.

---

## Estrutura

```
task-manager-test/      # raiz = projeto Laravel
├── app/
├── resources/
│   ├── css/            # Tailwind 4
│   └── js/             # SPA Vue 3
├── routes/
│   └── api.php
└── ...
```

---

## Requisitos

- PHP >= 8.2
- Composer
- Node.js >= 18

---

## Instalação

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

# Terminal 2 — frontend (Vite)
npm run dev
```

API disponível em `http://localhost:8000`.
Frontend disponível em `http://localhost:5173`.

> SQLite por padrão. Para MySQL, editar `DB_CONNECTION` e as variáveis `DB_*` no `.env`.

---

## API

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar projetos com contagem de tarefas |
| POST | `/api/projects` | Criar projeto |
| GET | `/api/projects/{id}/tasks` | Listar tarefas do projeto |
| POST | `/api/projects/{id}/tasks` | Criar tarefa |
| PATCH | `/api/tasks/{id}` | Atualizar status/prioridade |
| DELETE | `/api/tasks/{id}` | Eliminar tarefa |

### Filtros em `GET /api/projects/{id}/tasks`

| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `status` | `?status=todo` | Filtra pelo status |
| `priority` | `?priority=high` | Filtra pela prioridade |
| `overdue` | `?overdue=true` | Apenas tarefas em atraso |
| `due_date` | `?due_date=2026-06-10` | Filtra por data exata |

### Formato de resposta

```json
{ "message": "...", "code": 200, "data": { ... } }
```

Listas paginadas incluem `meta` e `links` com cursor de paginação.

Erros de validação devolvem `422` com campo `errors`:
```json
{ "message": "Dados inválidos.", "code": 422, "data": null, "errors": { "name": ["..."] } }
```

---

## Testes

```bash
php vendor/bin/pest
```

---

## Decisões técnicas

**SQLite por pragmatismo** — sem necessidade de configurar servidor de BD; o foco do projeto é o código, não a infra.

**Enums PHP nativos** — `ProjectStatus`, `TaskStatus` e `TaskPriority` são backed enums com cast direto no model; valores inválidos são rejeitados antes de chegar à BD.

**Envelope de resposta `{ message, code, data }`** — formato uniforme em todos os endpoints para que o cliente saiba sempre onde estão os dados, a mensagem e o código.

**`BaseResource` com `only()`** — um único resource serve contextos diferentes (lista vs detalhe) sem duplicar classes.

**`FilterTaskRequest` em endpoint GET** — Form Request em endpoint de leitura mantém a validação centralizada e o controller limpo.

**Pest em vez de PHPUnit direto** — construído sobre PHPUnit (satisfaz o requisito), com sintaxe mais legível.

**`Route::fallback` para SPA** — só ativa quando nenhuma outra rota Laravel corresponde, sem depender da ordem de declaração.

**`useToast` com `ref` de módulo** — em vez de criar uma store Pinia só para toasts, o `ref` é declarado fora da função do composable, tornando-o um singleton partilhado por toda a app. Qualquer componente que chame `useToast()` acede ao mesmo array de toasts. O `ToastContainer` usa `Teleport` para renderizar diretamente no `<body>`, evitando problemas de `z-index` causados por stacking contexts intermédios.

**Optimistic updates em `updateTask`** — o status da tarefa é atualizado no store antes de a API responder, eliminando latência percebida. Se o pedido falhar, o estado anterior é restaurado e um toast de erro é exibido.

**Arquivar projeto (fora do spec)** — o modelo já tinha `ProjectStatus` com os valores `active` e `archived`, os scopes `scopeActive`/`scopeArchived` no model, e o campo `status` exposto na API. Implementar o `PATCH /api/projects/{id}` era a conclusão natural de uma estrutura que já estava preparada para isso. Deixar a funcionalidade a meio seria mais estranho do que completá-la.

**Filtro de projetos por estado (fora do spec)** — consequência direta da funcionalidade de arquivo. Assim que projetos podem ser arquivados, a lista precisa de uma forma de os separar visualmente; sem filtro, projetos arquivados misturam-se com os ativos e a lista torna-se confusa. Os tabs "Ativos / Arquivados / Todos" resolvem isso sem adicionar complexidade — é um `computed` sobre o array já existente no store, sem nenhum pedido extra à API.

---

## O que ficou por implementar

> A preencher no final.
