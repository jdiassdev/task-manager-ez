<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class FilterTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status'   => ['sometimes', 'string', new Enum(TaskStatus::class)],
            'priority' => ['sometimes', 'string', new Enum(TaskPriority::class)],
            'overdue'  => ['sometimes', 'boolean'],
            'due_date' => ['sometimes', 'date', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.Illuminate\Validation\Rules\Enum'   => 'O status deve ser "Pendente", "Em Progresso" ou "Concluído".',
            'priority.Illuminate\Validation\Rules\Enum' => 'A prioridade deve ser "Baixa", "Média" ou "Alta".',
            'overdue.boolean'        => 'O filtro de atraso deve ser verdadeiro ou falso.',
            'due_date.date'          => 'A data deve ser uma data válida.',
            'due_date.date_format'   => 'A data deve estar no formato YYYY-MM-DD.',
        ];
    }
}
