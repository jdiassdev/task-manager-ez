<?php

namespace App\Http\Controllers;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Http\Requests\FilterTaskRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function index(FilterTaskRequest $request, Project $project): JsonResponse
    {
        $tasks = $project->tasks()
            ->select(['id', 'project_id', 'title', 'description', 'status', 'priority', 'due_date', 'created_at', 'updated_at'])
            ->when($request->status, fn ($q) => $q->byStatus(TaskStatus::from($request->status)))
            ->when($request->priority, fn ($q) => $q->byPriority(TaskPriority::from($request->priority)))
            ->when($request->boolean('overdue'), fn ($q) => $q->overdue())
            ->when($request->due_date, fn ($q) => $q->whereDate('due_date', $request->due_date))
            ->cursorPaginate(20);

        $paginated = TaskResource::collection($tasks)->response()->getData(true);

        return response()->json([
            'message' => 'Tarefas listadas com sucesso.',
            'code'    => 200,
            'data'    => $paginated['data'],
            'meta'    => $paginated['meta'] ?? null,
            'links'   => $paginated['links'] ?? null,
        ], 200);
    }

    public function store(StoreTaskRequest $request, Project $project): JsonResponse
    {
        $task = $project->tasks()->create($request->validated());

        return response()->json([
            'message' => 'Tarefa criada com sucesso.',
            'code'    => 201,
            'data'    => (new TaskResource($task))->only(['id', 'project_id', 'title', 'description', 'status', 'priority', 'due_date', 'is_overdue']),
        ], 201);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $task->update($request->validated());

        return response()->json([
            'message' => 'Tarefa atualizada com sucesso.',
            'code'    => 200,
            'data'    => (new TaskResource($task))->only(['id', 'project_id', 'title', 'description', 'status', 'priority', 'due_date', 'is_overdue']),
        ], 200);
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json(null, 204);
    }
}
