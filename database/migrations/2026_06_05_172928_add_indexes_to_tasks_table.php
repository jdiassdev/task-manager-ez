<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // base de todas as queries de listagem
            $table->index(['project_id', 'deleted_at'], 'tasks_project_deleted_idx');

            // filtros de status e prioridade
            $table->index(['project_id', 'status', 'deleted_at'], 'tasks_project_status_idx');
            $table->index(['project_id', 'priority', 'deleted_at'], 'tasks_project_priority_idx');

            // filtro de data (overdue e due_date exato)
            $table->index(['project_id', 'due_date', 'deleted_at'], 'tasks_project_due_date_idx');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_project_deleted_idx');
            $table->dropIndex('tasks_project_status_idx');
            $table->dropIndex('tasks_project_priority_idx');
            $table->dropIndex('tasks_project_due_date_idx');
        });
    }
};
