<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateOwnPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Permet à l'utilisateur connecté de changer son propre mot de passe.
     */
    public function updatePassword(UpdateOwnPasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
            ], 422);
        }

        $user->update([
            'password' => $data['password'],
        ]);

        // Option de sécurité : déconnecter toutes les anciennes sessions API
        $user->tokens()->delete();

        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Mot de passe modifié avec succès.',
            'token' => $newToken,
            'token_type' => 'Bearer',
        ]);
    }
}