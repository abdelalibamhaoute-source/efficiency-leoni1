<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EfficiencyHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Efficiency\DeleteEfficiencyHistoryRequest;
use App\Models\EfficiencyHistoryReference;
use Illuminate\Support\Facades\DB;

class EfficiencyHistoryController extends Controller
{
    /**
     * Liste paginée des historiques avec filtres.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $search = trim($request->string('search')->toString());
        $teamId = $request->query('team_id');
        $status = $request->query('status');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $query = EfficiencyHistory::query()
            ->with([
                'team:id,name',
                'creator:id,name,email',
                'references.productReference:id,code',
            ]);

        // Admin يشوف كامل، shift leader غير team ديالو
        if ($user->isShiftLeader()) {
            $query->where('team_id', $user->team_id);
        }

        // Filter par équipe
        if (!empty($teamId)) {
            $query->where('team_id', $teamId);
        }

        // Filter par status
        if (!empty($status)) {
            $query->where('status', $status);
        }

        // Filter date début
        if (!empty($dateFrom)) {
            $query->whereDate('calculation_date', '>=', $dateFrom);
        }

        // Filter date fin
        if (!empty($dateTo)) {
            $query->whereDate('calculation_date', '<=', $dateTo);
        }

        // Recherche
        if (!empty($search)) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery
                    ->whereHas('team', function ($teamQuery) use ($search) {
                        $teamQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('references.productReference', function ($referenceQuery) use ($search) {
                        $referenceQuery->where('code', 'like', "%{$search}%");
                    });
            });
        }

        $histories = $query
            ->orderByDesc('calculation_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->through(function (EfficiencyHistory $history) {
                return [
                    'id' => $history->id,
                    'team' => [
                        'id' => $history->team?->id,
                        'name' => $history->team?->name,
                    ],
                    'references' => $history->references->map(function ($detail) {
                        return [
                            'product_reference_id' => $detail->product_reference_id,
                            'code' => $detail->productReference?->code,
                            'quantity' => $detail->quantity,
                            'gamme_time' => $detail->gamme_time,
                            'subtotal_gamme_time' => $detail->subtotal_gamme_time,
                        ];
                    })->values(),
                    'reference_codes' => $history->references
                        ->map(fn ($detail) => $detail->productReference?->code)
                        ->filter()
                        ->values(),
                    'quantity_total' => $history->quantity_total,
                    'operator_count' => $history->operator_count,
                    'work_time' => $history->work_time,
                    'total_gamme_time' => $history->total_gamme_time,
                    'objective' => $history->objective,
                    'efficiency_value' => $history->efficiency_value,
                    'status' => $history->status,
                    'calculation_date' => $history->calculation_date,
                    'created_by' => [
                        'id' => $history->creator?->id,
                        'name' => $history->creator?->name,
                        'email' => $history->creator?->email,
                    ],
                ];
            });

        return response()->json($histories);
    }

    /**
     * Afficher le détail d'un historique.
     */
    public function show(Request $request, EfficiencyHistory $efficiency_history): JsonResponse
    {
        $user = $request->user();

        // Shift leader غير team ديالو
        if ($user->isShiftLeader() && (int) $user->team_id !== (int) $efficiency_history->team_id) {
            return response()->json([
                'message' => 'Accès non autorisé à cet historique.',
            ], 403);
        }

        $efficiency_history->load([
            'team:id,name',
            'creator:id,name,email',
            'references.productReference:id,code,gamme_time',
        ]);

        return response()->json([
            'history' => [
                'id' => $efficiency_history->id,
                'team' => [
                    'id' => $efficiency_history->team?->id,
                    'name' => $efficiency_history->team?->name,
                ],
                'references' => $efficiency_history->references->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'product_reference_id' => $detail->product_reference_id,
                        'code' => $detail->productReference?->code,
                        'quantity' => $detail->quantity,
                        'gamme_time' => $detail->gamme_time,
                        'subtotal_gamme_time' => $detail->subtotal_gamme_time,
                    ];
                })->values(),
                'quantity_total' => $efficiency_history->quantity_total,
                'operator_count' => $efficiency_history->operator_count,
                'work_time' => $efficiency_history->work_time,
                'total_gamme_time' => $efficiency_history->total_gamme_time,
                'objective' => $efficiency_history->objective,
                'efficiency_value' => $efficiency_history->efficiency_value,
                'status' => $efficiency_history->status,
                'calculation_date' => $efficiency_history->calculation_date,
                'created_by' => [
                    'id' => $efficiency_history->creator?->id,
                    'name' => $efficiency_history->creator?->name,
                    'email' => $efficiency_history->creator?->email,
                ],
            ],
        ]);
    }
    public function destroyByTeams(DeleteEfficiencyHistoryRequest $request): JsonResponse
    {
        $data = $request->validated();

        $teamIds = $data['team_ids'];
        $dateFrom = $data['date_from'] ?? null;
        $dateTo = $data['date_to'] ?? null;

        $historyQuery = EfficiencyHistory::query()
            ->whereIn('team_id', $teamIds)
            ->when($dateFrom, fn ($q) => $q->whereDate('calculation_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('calculation_date', '<=', $dateTo));

        $historyIds = $historyQuery->pluck('id');

        if ($historyIds->isEmpty()) {
            return response()->json([
                'message' => 'Aucun historique trouvé pour les critères sélectionnés.',
            ], 404);
        }

        DB::transaction(function () use ($historyIds) {
            EfficiencyHistoryReference::query()
                ->whereIn('efficiency_history_id', $historyIds)
                ->delete();

            EfficiencyHistory::query()
                ->whereIn('id', $historyIds)
                ->delete();
        });

        return response()->json([
            'message' => 'Historique supprimé avec succès.',
            'deleted_count' => $historyIds->count(),
        ]);
    }
}