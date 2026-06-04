<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status'      => ['sometimes', 'string', new Enum(TaskStatus::class)],
            'priority'    => ['sometimes', 'string', new Enum(TaskPriority::class)],
            'due_date'    => ['nullable', 'date', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'O título da tarefa é obrigatório.',
            'title.max'      => 'O título não pode ter mais de :max caracteres.',
            'description.max' => 'A descrição não pode ter mais de :max caracteres.',
            'status.Illuminate\Validation\Rules\Enum'   => 'O status deve ser "Pendente", "Em Progresso" ou "Concluído".',
            'priority.Illuminate\Validation\Rules\Enum' => 'A prioridade deve ser "Baixa", "Média" ou "Alta".',
            'due_date.date'        => 'A data de entrega deve ser uma data válida.',
            'due_date.date_format' => 'A data de entrega deve estar no formato YYYY-MM-DD.',
        ];
    }
}
