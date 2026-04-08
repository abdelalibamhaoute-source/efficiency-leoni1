<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserPasswordRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UpdateUserStatusRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Liste paginée des utilisateurs.
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->string('search')->toString();

        $users = User::with('team')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(10);

        return response()->json($users);
    }

    /**
     * Créer un nouveau shift leader.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'team_id' => $data['team_id'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->syncRoles([$data['role']]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user->load('team'),
        ], 201);
    }

    /**
     * Mettre à jour les infos générales d'un utilisateur.
     */
   public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();
        $authenticatedUser = $request->user();

        // Empêche l'admin de modifier son propre rôle
        if ($authenticatedUser->id === $user->id && $data['role'] !== 'admin') {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre rôle.',
            ], 422);
        }

        // Empêche l'admin de désactiver son propre compte
        if ($authenticatedUser->id === $user->id && ! $data['is_active']) {
            return response()->json([
                'message' => 'Vous ne pouvez pas désactiver votre propre compte.',
            ], 422);
        }

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'team_id' => $data['team_id'] ?? null,
            'is_active' => $data['is_active'],
        ]);

        $user->syncRoles([$data['role']]);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'user' => $user->load('team'),
        ]);
    }

    /**
     * Activer ou désactiver un compte.
     */
    public function updateStatus(UpdateUserStatusRequest $request, User $user): JsonResponse
    {
        $authenticatedUser = $request->user();

        // Empêche un admin de se désactiver lui-même
        if ($authenticatedUser->id === $user->id && ! $request->boolean('is_active')) {
            return response()->json([
                'message' => 'Vous ne pouvez pas désactiver votre propre compte.',
            ], 422);
        }

        $user->update([
            'is_active' => $request->boolean('is_active'),
        ]);

        return response()->json([
            'message' => $user->is_active
                ? 'Compte activé avec succès.'
                : 'Compte désactivé avec succès.',
            'user' => $user->load('team'),
        ]);
    }

    /**
     * Changer le mot de passe d'un utilisateur par admin.
     */
    public function updatePassword(UpdateUserPasswordRequest $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Utilisez votre profil pour modifier votre propre mot de passe.',
            ], 422);
        }

        $user->update([
            'password' => $request->validated()['password'],
        ]);

        // Forcer reconnexion
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Mot de passe utilisateur mis à jour avec succès.',
        ]);
    }
}