# Task Manager

Backend em Laravel 12 (API RESTful) + frontend em Vue 3 + Tailwind 4 (SPA).

---

## Estrutura

```
task-manager-test/
├── backend/    # API Laravel 12
└── frontend/   # SPA Vue 3
```

---

## Backend

### Instalação

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API disponível em `http://localhost:8000`.

> SQLite por defeito. Para MySQL, editar `DB_CONNECTION` e as variáveis `DB_*` no `.env`.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar projetos com contagem de tarefas |
| POST | `/api/projects` | Criar projeto |
| GET | `/api/projects/{id}/tasks` | Listar tarefas do projeto |
| POST | `/api/projects/{id}/tasks` | Criar tarefa |
| PATCH | `/api/tasks/{id}` | Atualizar status/prioridade |
| DELETE | `/api/tasks/{id}` | Eliminar tarefa |

Filtros disponíveis em `GET /api/projects/{id}/tasks`: `?status=todo&priority=high&overdue=true&due_date=2026-06-10`

---

## Frontend

> A implementar.

---

## Decisões técnicas

**SQLite por defeito** — elimina a necessidade de configurar servidor de BD para correr o projeto. Trocar para MySQL é apenas alterar o `.env`.

**Enums PHP nativos** — `ProjectStatus`, `TaskStatus` e `TaskPriority` são backed enums com cast directo no model. Valores inválidos são rejeitados antes de chegar à base de dados.

**BaseResource com `only()`** — todos os resources estendem uma `BaseResource` que expõe um método `only(['campo1', 'campo2'])`. Permite reutilizar o mesmo resource em contextos diferentes (lista vs detalhe) sem criar classes duplicadas. Campos não listados são simplesmente omitidos da resposta.

---

