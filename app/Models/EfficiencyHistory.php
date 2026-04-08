<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EfficiencyHistory extends Model
{
    protected $fillable = [
        'team_id',
        'quantity_total',
        'operator_count',
        'work_time',
        'total_gamme_time',
        'objective',
        'efficiency_value',
        'status',
        'calculation_date',
        'created_by',
    ];

    protected $casts = [
        'work_time' => 'decimal:2',
        'total_gamme_time' => 'decimal:2',
        'objective' => 'decimal:2',
        'efficiency_value' => 'decimal:2',
        'calculation_date' => 'datetime',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function references(): HasMany
    {
        return $this->hasMany(EfficiencyHistoryReference::class);
    }
}