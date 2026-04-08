<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    /**
     * Les champs remplissables.
     */
    protected $fillable = [
        'name',
        'is_active',
    ];

    /**
     * Une équipe peut avoir plusieurs utilisateurs.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Une équipe peut avoir plusieurs historiques d'efficience.
     */
    public function efficiencyHistories(): HasMany
    {
        return $this->hasMany(EfficiencyHistory::class);
    }
}