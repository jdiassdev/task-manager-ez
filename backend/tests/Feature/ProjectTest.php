<?php

use App\Models\Project;
use App\Models\Task;

it('lista projetos com tasks_count', function () {
    Project::factory()->active()->has(Task::factory()->count(3))->create();
    Project::factory()->archived()->has(Task::factory()->count(1))->create();

    $response = $this->getJson('/api/projects');

    $response->assertStatus(200)
        ->assertJsonPath('code', 200)
        ->assertJsonStructure([
            'data' => ['*' => ['id', 'name', 'status', 'tasks_count']],
        ]);

    expect($response->json('data'))->toHaveCount(2);
});

it('cria projeto com dados válidos', function () {
    $response = $this->postJson('/api/projects', [
        'name'        => 'Novo Projeto',
        'description' => 'Descrição do projeto.',
        'status'      => 'active',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('code', 201)
        ->assertJsonPath('data.name', 'Novo Projeto')
        ->assertJsonPath('data.status', 'active');

    $this->assertDatabaseHas('projects', ['name' => 'Novo Projeto']);
});

it('falha ao criar projeto sem nome', function () {
    $response = $this->postJson('/api/projects', ['description' => 'Sem nome']);

    $response->assertStatus(422)
        ->assertJsonPath('code', 422)
        ->assertJsonStructure(['errors' => ['name']]);
});

it('falha ao criar projeto com status inválido', function () {
    $response = $this->postJson('/api/projects', [
        'name'   => 'Projeto',
        'status' => 'invalid',
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure(['errors' => ['status']]);
});
