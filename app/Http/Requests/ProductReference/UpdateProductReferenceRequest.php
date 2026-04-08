<?php

namespace App\Http\Requests\ProductReference;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductReferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation pour mise à jour d'une référence produit.
     */
    public function rules(): array
    {
        $referenceId = $this->route('product_reference')?->id;

        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('product_references', 'code')->ignore($referenceId),
            ],
            'gamme_time' => ['required', 'numeric', 'min:0.01'],
            'is_active' => ['required', 'boolean'],
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
            'is_active.required' => 'Le statut est obligatoire.',
            'is_active.boolean' => 'Le statut doit être vrai ou faux.',
        ];
    }
}