<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id'  => Project::factory(),
            'title'       => fake()->sentence(4, false),
            'description' => fake()->optional(0.7)->paragraph(),
            'status'      => fake()->randomElement(TaskStatus::cases())->value,
            'priority'    => fake()->randomElement(TaskPriority::cases())->value,
            'due_date'    => fake()->optional(0.8)->dateTimeBetween('-2 months', '+2 months')?->format('Y-m-d'),
        ];
    }

    public function overdue(): static
    {
        return $this->state([
            'due_date' => fake()->dateTimeBetween('-2 months', '-1 day')->format('Y-m-d'),
            'status'   => fake()->randomElement([TaskStatus::Todo->value, TaskStatus::InProgress->value]),
        ]);
    }

    public function done(): static
    {
        return $this->state(['status' => TaskStatus::Done->value]);
    }

    public function highPriority(): static
    {
        return $this->state(['priority' => TaskPriority::High->value]);
    }
}
