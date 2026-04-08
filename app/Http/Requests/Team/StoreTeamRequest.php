<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la création d'une équipe.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:teams,name'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de l’équipe est obligatoire.',
            'name.unique' => 'Cette équipe existe déjà.',
            'name.max' => 'Le nom de l’équipe est trop long.',
            'is_active.boolean' => 'Le statut doit être vrai ou faux.',
        ];
    }
}