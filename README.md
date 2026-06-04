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

### Requisitos

- PHP >= 8.2
- Composer

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

#### Filtros em `GET /api/projects/{id}/tasks`

| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `status` | `?status=todo` | Filtra pelo status |
| `priority` | `?priority=high` | Filtra pela prioridade |
| `overdue` | `?overdue=true` | Apenas tarefas em atraso |
| `due_date` | `?due_date=2026-06-10` | Filtra por data exacta |

#### Formato de resposta

```json
{ "message": "...", "code": 200, "data": { ... } }
```

Listas paginadas incluem também `meta` e `links` com o cursor de paginação.

Erros de validação devolvem `422` com campo `errors`:
```json
{ "message": "Dados inválidos.", "code": 422, "data": null, "errors": { "name": ["..."] } }
```

### Testes

```bash
php vendor/bin/pest
```

---

## Frontend

> A implementar.

---

## Decisões técnicas

**SQLite por defeito** — elimina a necessidade de configurar servidor de BD para correr o projeto. Trocar para MySQL é apenas alterar o `.env`.

**Enums PHP nativos** — `ProjectStatus`, `TaskStatus` e `TaskPriority` são backed enums com cast directo no model. Valores inválidos são rejeitados antes de chegar à base de dados.

**Envelope de resposta `{ message, code, data }`** — todas as respostas seguem o mesmo formato para garantir consistência no frontend: o cliente sabe sempre onde estão os dados, a mensagem e o código, independentemente do endpoint.

**`BaseResource` com `only()`** — todos os resources estendem uma `BaseResource` com método `only(['campo'])` que permite reutilizar o mesmo resource em contextos diferentes (lista vs detalhe) sem criar classes duplicadas.

**`FilterTaskRequest` em endpoint GET** — validar query parameters via Form Request, mesmo em endpoints de leitura, mantém a validação centralizada e o request reutilizável noutros contextos, em vez de espalhar regras pelo controller.

**Pest em vez de PHPUnit directo** — Pest é construído sobre PHPUnit (satisfaz o requisito), com sintaxe mais expressiva e legível. Os testes continuam a correr com o mesmo runner por baixo.

---

## O que ficou por implementar

> A preencher no final.

---

