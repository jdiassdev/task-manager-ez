<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 3 projetos activos com tarefas variadas
        Project::factory()
            ->active()
            ->count(3)
            ->create()
            ->each(function (Project $project) {
                // tarefas normais com datas variadas
                Task::factory()->count(5)->create(['project_id' => $project->id]);

                // tarefas em atraso
                Task::factory()->overdue()->count(2)->create(['project_id' => $project->id]);

                // tarefas concluídas
                Task::factory()->done()->count(2)->create(['project_id' => $project->id]);

                // uma tarefa de alta prioridade sem data
                Task::factory()->highPriority()->create([
                    'project_id' => $project->id,
                    'due_date'   => null,
                ]);
            });

        // 1 projecto arquivado com poucas tarefas
        $archived = Project::factory()->archived()->create();
        Task::factory()->done()->count(3)->create(['project_id' => $archived->id]);
    }
}
