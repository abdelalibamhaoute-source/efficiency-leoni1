<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EfficiencyHistory;
use App\Models\EfficiencyHistoryReference;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * Statistiques détaillées d'une équipe sur une période.
     */
    public function teamStats(Request $request, Team $team): JsonResponse
    {
        $user = $request->user();

        // Shift leader: accès uniquement à son équipe
        if ($user->isShiftLeader() && (int) $user->team_id !== (int) $team->id) {
            return response()->json([
                'message' => 'Accès non autorisé à cette équipe.',
            ], 403);
        }

        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $baseQuery = EfficiencyHistory::query()
            ->where('team_id', $team->id)
            ->when($dateFrom, fn ($q) => $q->whereDate('calculation_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('calculation_date', '<=', $dateTo));

        $summary = (clone $baseQuery)
            ->selectRaw('COUNT(*) as total_calculations')
            ->selectRaw('AVG(efficiency_value) as average_efficiency')
            ->selectRaw('MAX(efficiency_value) as best_efficiency')
            ->selectRaw('MIN(efficiency_value) as lowest_efficiency')
            ->selectRaw('AVG(objective) as average_objective')
            ->first();

        $referencesUsedCount = EfficiencyHistoryReference::query()
            ->whereHas('efficiencyHistory', function ($query) use ($team, $dateFrom, $dateTo) {
                $query->where('team_id', $team->id)
                    ->when($dateFrom, fn ($q) => $q->whereDate('calculation_date', '>=', $dateFrom))
                    ->when($dateTo, fn ($q) => $q->whereDate('calculation_date', '<=', $dateTo));
            })
            ->distinct('product_reference_id')
            ->count('product_reference_id');

        // Evolution de l’efficience dans le temps
        $efficiencyTrend = (clone $baseQuery)
            ->selectRaw('DATE(calculation_date) as day')
            ->selectRaw('AVG(efficiency_value) as average_efficiency')
            ->selectRaw('AVG(objective) as average_objective')
            ->groupBy(DB::raw('DATE(calculation_date)'))
            ->orderBy('day')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => $row->day,
                    'efficiency' => round((float) $row->average_efficiency, 2),
                    'objective' => round((float) $row->average_objective, 2),
                    'status' => ((float) $row->average_efficiency >= (float) $row->average_objective)
                        ? 'above_target'
                        : 'below_target',
                ];
            })
            ->values();

        // Historique filtré
        $history = (clone $baseQuery)
            ->with([
                'team:id,name',
                'references.productReference:id,code',
            ])
            ->orderByDesc('calculation_date')
            ->get()
            ->map(function (EfficiencyHistory $history) {
                return [
                    'id' => $history->id,
                    'calculation_date' => $history->calculation_date,
                    'efficiency_value' => $history->efficiency_value,
                    'objective' => $history->objective,
                    'status' => $history->status,
                    'operator_count' => $history->operator_count,
                    'work_time' => $history->work_time,
                    'quantity_total' => $history->quantity_total,
                    'total_gamme_time' => $history->total_gamme_time,
                    'reference_codes' => $history->references
                        ->map(fn ($detail) => $detail->productReference?->code)
                        ->filter()
                        ->values(),
                ];
            })
            ->values();

        // Références les plus utilisées
        $topReferences = EfficiencyHistoryReference::query()
            ->select('product_reference_id')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('COUNT(*) as usage_count')
            ->with('productReference:id,code')
            ->whereHas('efficiencyHistory', function ($query) use ($team, $dateFrom, $dateTo) {
                $query->where('team_id', $team->id)
                    ->when($dateFrom, fn ($q) => $q->whereDate('calculation_date', '>=', $dateFrom))
                    ->when($dateTo, fn ($q) => $q->whereDate('calculation_date', '<=', $dateTo));
            })
            ->groupBy('product_reference_id')
            ->orderByDesc('usage_count')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get()
            ->map(function ($row) {
                return [
                    'product_reference_id' => $row->product_reference_id,
                    'code' => $row->productReference?->code,
                    'usage_count' => (int) $row->usage_count,
                    'total_quantity' => (int) $row->total_quantity,
                ];
            })
            ->values();

        return response()->json([
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'summary' => [
                'total_calculations' => (int) ($summary->total_calculations ?? 0),
                'average_efficiency' => round((float) ($summary->average_efficiency ?? 0), 2),
                'best_efficiency' => round((float) ($summary->best_efficiency ?? 0), 2),
                'lowest_efficiency' => round((float) ($summary->lowest_efficiency ?? 0), 2),
                'average_objective' => round((float) ($summary->average_objective ?? 0), 2),
                'references_used_count' => $referencesUsedCount,
            ],
            'charts' => [
                'efficiency_trend' => $efficiencyTrend,
                'efficiency_vs_objective' => $efficiencyTrend,
                'top_references' => $topReferences,
            ],
            'history' => $history,
        ]);
    }

    /**
     * Statistiques globales sur toutes les équipes.
     */
    public function globalStats(Request $request): JsonResponse
    {
        $user = $request->user();

        // Shift leader: global = uniquement sa propre équipe
        $teamId = $user->isShiftLeader() ? $user->team_id : $request->query('team_id');

        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $baseQuery = EfficiencyHistory::query()
            ->when($teamId, fn ($q) => $q->where('team_id', $teamId))
            ->when($dateFrom, fn ($q) => $q->whereDate('calculation_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('calculation_date', '<=', $dateTo));

        $summary = (clone $baseQuery)
            ->selectRaw('COUNT(*) as total_calculations')
            ->selectRaw('AVG(efficiency_value) as average_efficiency')
            ->selectRaw('MAX(efficiency_value) as best_efficiency')
            ->selectRaw('MIN(efficiency_value) as lowest_efficiency')
            ->selectRaw('AVG(objective) as average_objective')
            ->first();

        $teamsStats = (clone $baseQuery)
            ->select('team_id')
            ->selectRaw('COUNT(*) as total_calculations')
            ->selectRaw('AVG(efficiency_value) as average_efficiency')
            ->selectRaw('AVG(objective) as average_objective')
            ->with('team:id,name')
            ->groupBy('team_id')
            ->orderByDesc('average_efficiency')
            ->get()
            ->map(function ($row) {
                return [
                    'team_id' => $row->team_id,
                    'team_name' => $row->team?->name,
                    'total_calculations' => (int) $row->total_calculations,
                    'average_efficiency' => round((float) $row->average_efficiency, 2),
                    'average_objective' => round((float) $row->average_objective, 2),
                    'status' => ((float) $row->average_efficiency >= (float) $row->average_objective)
                        ? 'above_target'
                        : 'below_target',
                ];
            })
            ->values();

        $globalTrend = (clone $baseQuery)
            ->selectRaw('DATE(calculation_date) as day')
            ->selectRaw('AVG(efficiency_value) as average_efficiency')
            ->selectRaw('AVG(objective) as average_objective')
            ->groupBy(DB::raw('DATE(calculation_date)'))
            ->orderBy('day')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => $row->day,
                    'efficiency' => round((float) $row->average_efficiency, 2),
                    'objective' => round((float) $row->average_objective, 2),
                    'status' => ((float) $row->average_efficiency >= (float) $row->average_objective)
                        ? 'above_target'
                        : 'below_target',
                ];
            })
            ->values();

        return response()->json([
            'filters' => [
                'team_id' => $teamId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'summary' => [
                'total_calculations' => (int) ($summary->total_calculations ?? 0),
                'average_efficiency' => round((float) ($summary->average_efficiency ?? 0), 2),
                'best_efficiency' => round((float) ($summary->best_efficiency ?? 0), 2),
                'lowest_efficiency' => round((float) ($summary->lowest_efficiency ?? 0), 2),
                'average_objective' => round((float) ($summary->average_objective ?? 0), 2),
            ],
            'charts' => [
                'global_trend' => $globalTrend,
                'teams_comparison' => $teamsStats,
            ],
            'teams' => $teamsStats,
        ]);
    }

    /**
     * Comparaison des équipes par période.
     */
    public function teamsComparison(Request $request): JsonResponse
    {
        $user = $request->user();

        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $query = EfficiencyHistory::query()
            ->when($user->isShiftLeader(), fn ($q) => $q->where('team_id', $user->team_id))
            ->when($dateFrom, fn ($q) => $q->whereDate('calculation_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('calculation_date', '<=', $dateTo))
            ->select('team_id')
            ->selectRaw('COUNT(*) as total_calculations')
            ->selectRaw('AVG(efficiency_value) as average_efficiency')
            ->selectRaw('AVG(objective) as average_objective')
            ->with('team:id,name')
            ->groupBy('team_id')
            ->orderByDesc('average_efficiency');

        $comparison = $query->get()->map(function ($row) {
            return [
                'team_id' => $row->team_id,
                'team_name' => $row->team?->name,
                'total_calculations' => (int) $row->total_calculations,
                'average_efficiency' => round((float) $row->average_efficiency, 2),
                'average_objective' => round((float) $row->average_objective, 2),
                'status' => ((float) $row->average_efficiency >= (float) $row->average_objective)
                    ? 'above_target'
                    : 'below_target',
            ];
        })->values();

        return response()->json([
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'comparison' => $comparison,
        ]);
    }
}