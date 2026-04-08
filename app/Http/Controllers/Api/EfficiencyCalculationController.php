<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Efficiency\StoreEfficiencyCalculationRequest;
use App\Models\Team;
use App\Services\EfficiencyCalculationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class EfficiencyCalculationController extends Controller
{
    public function __construct(
        protected EfficiencyCalculationService $efficiencyCalculationService
    ) {
    }

    /**
     * Calculer l'efficience et enregistrer l'historique.
     *
     * @throws ValidationException
     */
    public function store(StoreEfficiencyCalculationRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if (!isset($data['team_id']) || empty($data['team_id'])) {
            return response()->json([
                'message' => 'L’équipe est obligatoire.',
            ], 422);
        }

        $team = Team::query()->find($data['team_id']);

        if (!$team) {
            return response()->json([
                'message' => 'L’équipe sélectionnée est invalide.',
            ], 422);
        }

        // Shift leader: غير الفريق ديالو
        if ($user->isShiftLeader()) {
            if (!$user->team_id) {
                throw ValidationException::withMessages([
                    'team_id' => ['Votre compte n’est lié à aucune équipe.'],
                ]);
            }

            if ((int) $user->team_id !== (int) $team->id) {
                throw ValidationException::withMessages([
                    'team_id' => ['Vous ne pouvez calculer l’efficience que pour votre propre équipe.'],
                ]);
            }
        }

        $history = $this->efficiencyCalculationService->calculateAndStore($data, $user);

        return response()->json([
            'message' => 'Calcul d’efficience effectué avec succès.',
            'result' => [
                'history_id' => $history->id,
                'team' => [
                    'id' => $history->team->id,
                    'name' => $history->team->name,
                ],
                'quantity_total' => $history->quantity_total,
                'operator_count' => $history->operator_count,
                'work_time' => $history->work_time,
                'total_gamme_time' => $history->total_gamme_time,
                'objective' => $history->objective,
                'efficiency_value' => $history->efficiency_value,
                'status' => $history->status,
                'calculation_date' => $history->calculation_date,
                'references' => $history->references->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'product_reference_id' => $detail->product_reference_id,
                        'code' => $detail->productReference?->code,
                        'quantity' => $detail->quantity,
                        'gamme_time' => $detail->gamme_time,
                        'subtotal_gamme_time' => $detail->subtotal_gamme_time,
                    ];
                })->values(),
            ],
        ], 201);
    }
}