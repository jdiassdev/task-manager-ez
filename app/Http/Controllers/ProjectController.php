<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::query()->select(['id', 'name', 'description', 'status'])->withCount('tasks')->get();

        $collection = ProjectResource::collection($projects);
        $collection->collection->each(fn($r) => $r->only(['id', 'name', 'description', 'status', 'tasks_count']));

        return response()->json([
            'message' => 'Projetos listados com sucesso.',
            'code'    => 200,
            'data'    => $collection,
        ], 200);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::create($request->validated());

        return response()->json([
            'message' => 'Projeto criado com sucesso.',
            'code'    => 201,
            'data'    => (new ProjectResource($project->loadCount('tasks')))->only(['id', 'name', 'description', 'status', 'tasks_count']),
        ], 201);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());

        return response()->json([
            'message' => 'Projeto atualizado com sucesso.',
            'code'    => 200,
            'data'    => (new ProjectResource($project->loadCount('tasks')))->only(['id', 'name', 'description', 'status', 'tasks_count']),
        ]);
    }
}
