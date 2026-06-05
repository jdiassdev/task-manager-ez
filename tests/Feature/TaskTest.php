<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_tarefas_do_projeto(): void
    {
        $project = Project::factory()->has(Task::factory()->count(5))->create();

        $response = $this->getJson("/api/projects/{$project->id}/tasks");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'title', 'status', 'priority', 'is_overdue']],
            ]);

        $this->assertCount(5, $response->json('data'));
    }

    public function test_filtra_tarefas_por_status(): void
    {
        $project = Project::factory()->create();
        Task::factory()->count(3)->create(['project_id' => $project->id, 'status' => 'todo']);
        Task::factory()->count(2)->create(['project_id' => $project->id, 'status' => 'done']);

        $response = $this->getJson("/api/projects/{$project->id}/tasks?status=todo");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));

        foreach ($response->json('data') as $task) {
            $this->assertSame('todo', $task['status']);
        }
    }

    public function test_filtra_tarefas_por_prioridade(): void
    {
        $project = Project::factory()->create();
        Task::factory()->count(2)->create(['project_id' => $project->id, 'priority' => 'high']);
        Task::factory()->count(3)->create(['project_id' => $project->id, 'priority' => 'low']);

        $response = $this->getJson("/api/projects/{$project->id}/tasks?priority=high");

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_cria_tarefa_no_projeto(): void
    {
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
    }

    public function test_falha_ao_criar_tarefa_sem_titulo(): void
    {
        $project = Project::factory()->create();

        $this->postJson("/api/projects/{$project->id}/tasks", ['priority' => 'low'])
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['title']]);
    }

    public function test_atualiza_status_da_tarefa(): void
    {
        $task = Task::factory()->create(['status' => 'todo']);

        $response = $this->patchJson("/api/tasks/{$task->id}", ['status' => 'done']);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'done');

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status' => 'done']);
    }

    public function test_falha_ao_atualizar_tarefa_com_status_invalido(): void
    {
        $task = Task::factory()->create();

        $this->patchJson("/api/tasks/{$task->id}", ['status' => 'flying'])
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['status']]);
    }

    public function test_elimina_tarefa_com_soft_delete(): void
    {
        $task = Task::factory()->create();

        $this->deleteJson("/api/tasks/{$task->id}")->assertStatus(204);

        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }

    public function test_rejeita_filtro_overdue_com_status_done(): void
    {
        $project = Project::factory()->create();

        $this->getJson("/api/projects/{$project->id}/tasks?overdue=1&status=done")
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['overdue']]);
    }

    public function test_retorna_404_para_projeto_inexistente(): void
    {
        $this->getJson('/api/projects/99999/tasks')
            ->assertStatus(404)
            ->assertJsonPath('code', 404);
    }
}
