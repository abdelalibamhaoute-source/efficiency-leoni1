<?php

namespace App\Services;

use App\Models\EfficiencyHistory;
use App\Models\ProductReference;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EfficiencyCalculationService
{
    /**
     * Exécuter le calcul d'efficience et sauvegarder l'historique.
     *
     * @throws ValidationException
     */
    public function calculateAndStore(array $data, User $user): EfficiencyHistory
    {
        $referenceInputs = collect($data['references']);

        // جلب جميع references المطلوبة دفعة واحدة
        $referenceIds = $referenceInputs
            ->pluck('product_reference_id')
            ->unique()
            ->values();

        $references = ProductReference::query()
            ->whereIn('id', $referenceIds)
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        // تأكد أن كل references موجودة وفعالة
        foreach ($referenceInputs as $item) {
            if (! $references->has($item['product_reference_id'])) {
                throw ValidationException::withMessages([
                    'references' => ['Une ou plusieurs références sont introuvables ou inactives.'],
                ]);
            }
        }

        $details = [];
        $totalGammeTime = 0;
        $quantityTotal = 0;

        foreach ($referenceInputs as $item) {
            $reference = $references[$item['product_reference_id']];
            $quantity = (int) $item['quantity'];
            $gammeTime = (float) $reference->gamme_time;
            $subtotalGammeTime = $quantity * $gammeTime;

            $details[] = [
                'product_reference_id' => $reference->id,
                'code' => $reference->code,
                'quantity' => $quantity,
                'gamme_time' => round($gammeTime, 2),
                'subtotal_gamme_time' => round($subtotalGammeTime, 2),
            ];

            $quantityTotal += $quantity;
            $totalGammeTime += $subtotalGammeTime;
        }

        $operatorCount = (int) $data['operator_count'];
        $workTime = (float) $data['work_time'];
        $objective = (float) $data['objective'];

        $denominator = $operatorCount * $workTime;

        if ($denominator <= 0) {
            throw ValidationException::withMessages([
                'work_time' => ['Le produit (nombre d’opérateurs × temps de travail) doit être supérieur à zéro.'],
            ]);
        }

        $efficiencyValue = ($totalGammeTime / $denominator) * 100;
        $efficiencyValue = round($efficiencyValue, 2);

        $status = $efficiencyValue >= $objective ? 'above_target' : 'below_target';

        return DB::transaction(function () use (
            $data,
            $user,
            $quantityTotal,
            $totalGammeTime,
            $objective,
            $operatorCount,
            $workTime,
            $efficiencyValue,
            $status,
            $details
        ) {
            $history = EfficiencyHistory::create([
                'team_id' => $data['team_id'],
                'quantity_total' => $quantityTotal,
                'operator_count' => $operatorCount,
                'work_time' => round($workTime, 2),
                'total_gamme_time' => round($totalGammeTime, 2),
                'objective' => round($objective, 2),
                'efficiency_value' => $efficiencyValue,
                'status' => $status,
                'calculation_date' => $data['calculation_date'] ?? now(),
                'created_by' => $user->id,
            ]);

            foreach ($details as $detail) {
                $history->references()->create([
                    'product_reference_id' => $detail['product_reference_id'],
                    'quantity' => $detail['quantity'],
                    'gamme_time' => $detail['gamme_time'],
                    'subtotal_gamme_time' => $detail['subtotal_gamme_time'],
                ]);
            }

            return $history->load([
                'team',
                'creator',
                'references.productReference'
            ]);
        });
    }
}