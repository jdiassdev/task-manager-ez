<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $attributes = [
        'status'   => 'todo',
        'priority' => 'medium',
    ];

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'status'   => TaskStatus::class,
        'priority' => TaskPriority::class,
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereNotNull('due_date')
            ->where('due_date', '<', Carbon::today())
            ->where('status', '!=', TaskStatus::Done->value);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', '!=', TaskStatus::Done->value);
    }

    public function scopeByStatus(Builder $query, TaskStatus $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeByPriority(Builder $query, TaskPriority $priority): Builder
    {
        return $query->where('priority', $priority);
    }
}
