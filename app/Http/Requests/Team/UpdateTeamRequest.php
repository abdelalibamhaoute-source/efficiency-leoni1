<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la mise à jour d'une équipe.
     */
    public function rules(): array
    {
        $teamId = $this->route('team')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('teams', 'name')->ignore($teamId),
            ],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de l’équipe est obligatoire.',
            'name.unique' => 'Cette équipe existe déjà.',
            'name.max' => 'Le nom de l’équipe est trop long.',
            'is_active.required' => 'Le statut de l’équipe est obligatoire.',
            'is_active.boolean' => 'Le statut doit être vrai ou faux.',
        ];
    }
}