<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_projetos_com_tasks_count(): void
    {
        Project::factory()->active()->has(Task::factory()->count(3))->create();
        Project::factory()->archived()->has(Task::factory()->count(1))->create();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonPath('code', 200)
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name', 'status', 'tasks_count']],
            ]);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_cria_projeto_com_dados_validos(): void
    {
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
    }

    public function test_falha_ao_criar_projeto_sem_nome(): void
    {
        $response = $this->postJson('/api/projects', ['description' => 'Sem nome']);

        $response->assertStatus(422)
            ->assertJsonPath('code', 422)
            ->assertJsonStructure(['errors' => ['name']]);
    }

    public function test_falha_ao_criar_projeto_com_status_invalido(): void
    {
        $response = $this->postJson('/api/projects', [
            'name'   => 'Projeto',
            'status' => 'invalid',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['status']]);
    }
}
