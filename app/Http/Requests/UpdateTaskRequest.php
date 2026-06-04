<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateTaskRequest extends FormRequest
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
        ];
    }

    public function messages(): array
    {
        return [
            'status.Illuminate\Validation\Rules\Enum'   => 'O status deve ser "Pendente", "Em Progresso" ou "Concluído".',
            'priority.Illuminate\Validation\Rules\Enum' => 'A prioridade deve ser "Baixa", "Média" ou "Alta".',
        ];
    }
}
