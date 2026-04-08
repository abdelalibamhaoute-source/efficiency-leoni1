<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductReference extends Model
{
    protected $fillable = [
        'code',
        'gamme_time',
        'is_active',
    ];

    protected $casts = [
        'gamme_time' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Une référence peut apparaître dans plusieurs détails d'historique.
     */
    public function efficiencyHistoryReferences(): HasMany
    {
        return $this->hasMany(EfficiencyHistoryReference::class);
    }
}