<?php

namespace App\Http\Requests\ProductReference;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductReferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation pour création d'une référence produit.
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', 'unique:product_references,code'],
            'gamme_time' => ['required', 'numeric', 'min:0.01'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Le code de référence est obligatoire.',
            'code.unique' => 'Cette référence existe déjà.',
            'code.max' => 'Le code de référence est trop long.',
            'gamme_time.required' => 'Le temps gamme est obligatoire.',
            'gamme_time.numeric' => 'Le temps gamme doit être numérique.',
            'gamme_time.min' => 'Le temps gamme doit être supérieur à zéro.',
            'is_active.boolean' => 'Le statut doit être vrai ou faux.',
        ];
    }
}