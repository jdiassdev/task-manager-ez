<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status'      => ['sometimes', 'string', new Enum(ProjectStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do projeto é obrigatório.',
            'name.max'      => 'O nome não pode ter mais de :max caracteres.',
            'description.max' => 'A descrição não pode ter mais de :max caracteres.',
            'status.Illuminate\Validation\Rules\Enum' => 'O status deve ser "Ativo" ou "Arquivado".',
        ];
    }
}
