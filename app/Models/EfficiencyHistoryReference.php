<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EfficiencyHistoryReference extends Model
{
    protected $fillable = [
        'efficiency_history_id',
        'product_reference_id',
        'quantity',
        'gamme_time',
        'subtotal_gamme_time',
    ];

    protected $casts = [
        'gamme_time' => 'decimal:2',
        'subtotal_gamme_time' => 'decimal:2',
    ];

    public function efficiencyHistory(): BelongsTo
    {
        return $this->belongsTo(EfficiencyHistory::class);
    }

    public function productReference(): BelongsTo
    {
        return $this->belongsTo(ProductReference::class);
    }
}