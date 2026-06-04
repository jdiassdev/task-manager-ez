<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'        => fake()->unique()->catchPhrase(),
            'description' => fake()->paragraph(2),
            'status'      => fake()->randomElement(ProjectStatus::cases())->value,
        ];
    }

    public function active(): static
    {
        return $this->state(['status' => ProjectStatus::Active->value]);
    }

    public function archived(): static
    {
        return $this->state(['status' => ProjectStatus::Archived->value]);
    }
}
