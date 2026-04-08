<?php

namespace App\Http\Requests\Efficiency;

use Illuminate\Foundation\Http\FormRequest;

class DeleteEfficiencyHistoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_ids' => ['required', 'array', 'min:1'],
            'team_ids.*' => ['integer', 'exists:teams,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ];
    }

    public function messages(): array
    {
        return [
            'team_ids.required' => 'Veuillez sélectionner au moins une équipe.',
            'team_ids.array' => 'Le champ équipes doit être un tableau.',
            'team_ids.min' => 'Veuillez sélectionner au moins une équipe.',
            'team_ids.*.exists' => 'Une équipe sélectionnée est invalide.',
            'date_to.after_or_equal' => 'La date de fin doit être supérieure ou égale à la date de début.',
        ];
    }
}