<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * Important pour Spatie lorsque l’on utilise l’auth guard API.
     */
    protected string $guard_name = 'sanctum';

    /**
     * Les attributs remplissables.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'team_id',
        'is_active',
    ];

    /**
     * Les attributs cachés.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Un user peut appartenir à une équipe.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Historique des calculs créés par l'utilisateur.
     */
    public function createdEfficiencyHistories(): HasMany
    {
        return $this->hasMany(EfficiencyHistory::class, 'created_by');
    }
        /**
     * Vérifie si l'utilisateur est administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->hasRole('admin');
    }

    /**
     * Vérifie si l'utilisateur est shift leader.
     */
    public function isShiftLeader(): bool
    {
        return $this->role === 'shift_leader' || $this->hasRole('shift_leader');
    }
    
}