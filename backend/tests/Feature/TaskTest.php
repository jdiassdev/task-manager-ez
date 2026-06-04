<?php

use App\Models\Project;
use App\Models\Task;

it('lista tarefas do projeto', function () {
    $project = Project::factory()->has(Task::factory()->count(5))->create();

    $response = $this->getJson("/api/projects/{$project->id}/tasks");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => ['*' => ['id', 'title', 'status', 'priority', 'is_overdue']],
        ]);

    expect($response->json('data'))->toHaveCount(5);
});

it('filtra tarefas por status', function () {
    $project = Project::factory()->create();
    Task::factory()->count(3)->create(['project_id' => $project->id, 'status' => 'todo']);
    Task::factory()->count(2)->create(['project_id' => $project->id, 'status' => 'done']);

    $response = $this->getJson("/api/projects/{$project->id}/tasks?status=todo");

    $response->assertStatus(200);

    expect($response->json('data'))
        ->toHaveCount(3)
        ->each(fn ($item) => $item->toMatchArray(['status' => 'todo']));
});

it('filtra tarefas por prioridade', function () {
    $project = Project::factory()->create();
    Task::factory()->count(2)->create(['project_id' => $project->id, 'priority' => 'high']);
    Task::factory()->count(3)->create(['project_id' => $project->id, 'priority' => 'low']);

    $response = $this->getJson("/api/projects/{$project->id}/tasks?priority=high");

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(2);
});

it('cria tarefa no projeto', function () {
    $project = Project::factory()->create();

    $response = $this->postJson("/api/projects/{$project->id}/tasks", [
        'title'    => 'Nova Tarefa',
        'priority' => 'high',
        'due_date' => '2026-12-31',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('code', 201)
        ->assertJsonPath('data.title', 'Nova Tarefa')
        ->assertJsonPath('data.priority', 'high');

    $this->assertDatabaseHas('tasks', ['title' => 'Nova Tarefa', 'project_id' => $project->id]);
});

it('falha ao criar tarefa sem título', function () {
    $project = Project::factory()->create();

    $this->postJson("/api/projects/{$project->id}/tasks", ['priority' => 'low'])
        ->assertStatus(422)
        ->assertJsonStructure(['errors' => ['title']]);
});

it('atualiza status da tarefa', function () {
    $task = Task::factory()->create(['status' => 'todo']);

    $response = $this->patchJson("/api/tasks/{$task->id}", ['status' => 'done']);

    $response->assertStatus(200)
        ->assertJsonPath('data.status', 'done');

    $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status' => 'done']);
});

it('falha ao atualizar tarefa com status inválido', function () {
    $task = Task::factory()->create();

    $this->patchJson("/api/tasks/{$task->id}", ['status' => 'flying'])
        ->assertStatus(422)
        ->assertJsonStructure(['errors' => ['status']]);
});

it('elimina tarefa com soft delete', function () {
    $task = Task::factory()->create();

    $this->deleteJson("/api/tasks/{$task->id}")->assertStatus(200);

    $this->assertSoftDeleted('tasks', ['id' => $task->id]);
});

it('retorna 404 para projeto inexistente', function () {
    $this->getJson('/api/projects/99999/tasks')
        ->assertStatus(404)
        ->assertJsonPath('code', 404);
});
