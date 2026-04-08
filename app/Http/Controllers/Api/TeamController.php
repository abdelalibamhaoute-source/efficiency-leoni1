<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\StoreTeamRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Liste paginée des équipes avec recherche.
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->string('search')->toString();

        $teams = Team::query()
            ->withCount(['users', 'efficiencyHistories'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10);

        return response()->json($teams);
    }

    /**
     * Créer une nouvelle équipe.
     */
    public function store(StoreTeamRequest $request): JsonResponse
    {
        $data = $request->validated();

        $team = Team::create([
            'name' => $data['name'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Équipe créée avec succès.',
            'team' => $team,
        ], 201);
    }

    /**
     * Afficher une équipe avec ses compteurs.
     */
    public function show(Team $team): JsonResponse
    {
        $team->loadCount(['users', 'efficiencyHistories']);

        return response()->json([
            'team' => $team,
        ]);
    }

    /**
     * Mettre à jour une équipe.
     */
    public function update(UpdateTeamRequest $request, Team $team): JsonResponse
    {
        $data = $request->validated();

        $team->update([
            'name' => $data['name'],
            'is_active' => $data['is_active'],
        ]);

        return response()->json([
            'message' => 'Équipe mise à jour avec succès.',
            'team' => $team,
        ]);
    }

    /**
     * Supprimer une équipe si elle n'est liée à aucun utilisateur
     * et à aucun historique d'efficience.
     */
    public function destroy(Team $team): JsonResponse
    {
        $usersCount = $team->users()->count();
        $historiesCount = $team->efficiencyHistories()->count();

        if ($usersCount > 0 || $historiesCount > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cette équipe car elle est liée à des utilisateurs ou à un historique.',
            ], 422);
        }

        $team->delete();

        return response()->json([
            'message' => 'Équipe supprimée avec succès.',
        ]);
    }
}