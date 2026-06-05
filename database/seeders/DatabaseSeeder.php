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
        $main = Project::factory()->active()->create(['name' => 'Projeto Principal']);

        Task::factory()->count(10)->create(['project_id' => $main->id]);
        Task::factory()->overdue()->count(5)->create(['project_id' => $main->id]);
        Task::factory()->done()->count(8)->create(['project_id' => $main->id]);
        Task::factory()->highPriority()->count(5)->create(['project_id' => $main->id]);
        Task::factory()->count(7)->create(['project_id' => $main->id, 'due_date' => null]);

        Project::factory()
            ->active()
            ->count(3)
            ->create()
            ->each(function (Project $project) {
                Task::factory()->count(5)->create(['project_id' => $project->id]);
                Task::factory()->overdue()->count(2)->create(['project_id' => $project->id]);
                Task::factory()->done()->count(2)->create(['project_id' => $project->id]);
                Task::factory()->highPriority()->create(['project_id' => $project->id, 'due_date' => null]);
            });

        Project::factory()->archived()->count(2)->create()->each(function (Project $project) {
            Task::factory()->done()->count(3)->create(['project_id' => $project->id]);
        });
    }
}
