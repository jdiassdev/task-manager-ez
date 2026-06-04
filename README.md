# Task Manager

API RESTful em Laravel 12 com SPA Vue 3 + Tailwind 4 integrada via Vite.

---

## Estrutura

```
task-manager-test/      # raiz = projecto Laravel
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

> SQLite por defeito. Para MySQL, editar `DB_CONNECTION` e as variáveis `DB_*` no `.env`.

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
| `due_date` | `?due_date=2026-06-10` | Filtra por data exacta |

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

**SQLite por defeito** — elimina a necessidade de configurar servidor de BD para correr o projeto.

**Enums PHP nativos** — `ProjectStatus`, `TaskStatus` e `TaskPriority` são backed enums com cast directo no model.

**Envelope de resposta `{ message, code, data }`** — todas as respostas seguem o mesmo formato para garantir consistência no cliente.

**`BaseResource` com `only()`** — reutiliza o mesmo resource em contextos diferentes (lista vs detalhe) sem classes duplicadas.

**`FilterTaskRequest` em endpoint GET** — validação de query parameters via Form Request, centralizada e reutilizável.

**Pest em vez de PHPUnit directo** — construído sobre PHPUnit, com sintaxe mais expressiva.

---

## O que ficou por implementar

> A preencher no final.
