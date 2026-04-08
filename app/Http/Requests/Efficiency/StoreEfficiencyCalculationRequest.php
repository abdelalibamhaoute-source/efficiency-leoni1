<?php

namespace App\Http\Requests\Efficiency;

use Illuminate\Foundation\Http\FormRequest;

class StoreEfficiencyCalculationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation de la requête de calcul d'efficience.
     */
    public function rules(): array
    {
        return [
            'team_id' => ['required', 'exists:teams,id'],
            'objective' => ['required', 'numeric', 'min:0.01'],
            'operator_count' => ['required', 'integer', 'min:1'],
            'work_time' => ['required', 'numeric', 'min:0.01'],
            'calculation_date' => ['nullable', 'date'],
            'references' => ['required', 'array', 'min:1'],
            'references.*.product_reference_id' => ['required', 'integer', 'exists:product_references,id'],
            'references.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'team_id.required' => 'L’équipe est obligatoire.',
            'team_id.exists' => 'L’équipe sélectionnée est invalide.',
            'objective.required' => 'L’objectif est obligatoire.',
            'operator_count.required' => 'Le nombre d’opérateurs est obligatoire.',
            'work_time.required' => 'Le temps de travail est obligatoire.',
            'references.required' => 'Au moins une référence est obligatoire.',
        ];
    }
}