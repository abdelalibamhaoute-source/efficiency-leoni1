<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EfficiencyCalculationController;
use App\Http\Controllers\Api\EfficiencyHistoryController;
use App\Http\Controllers\Api\ProductReferenceController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TestAccessController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware(['auth:sanctum', 'active'])->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profil
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);

    // Tests d'accès
    Route::get('/admin-only', [TestAccessController::class, 'adminOnly'])
        ->middleware('role:admin');

    Route::get('/shift-only', [TestAccessController::class, 'shiftLeaderOnly'])
        ->middleware('role:shift_leader');

    // Calcul d’efficience
    Route::post('/efficiency-calculations', [EfficiencyCalculationController::class, 'store'])
        ->middleware('role_or_permission:admin|calculate own efficiency|calculate efficiency');

    // Historique des calculs
    Route::get('/efficiency-histories', [EfficiencyHistoryController::class, 'index'])
        ->middleware('role_or_permission:admin|view own histories|view all histories');

    Route::get('/efficiency-histories/{efficiency_history}', [EfficiencyHistoryController::class, 'show'])
        ->middleware('role_or_permission:admin|view own histories|view all histories');

    // Statistiques
    Route::get('/statistics/global', [StatisticsController::class, 'globalStats'])
        ->middleware('role_or_permission:admin|view own statistics|view global statistics');

    Route::get('/statistics/teams-comparison', [StatisticsController::class, 'teamsComparison'])
        ->middleware('role_or_permission:admin|view own statistics|view global statistics');

    Route::get('/statistics/teams/{team}', [StatisticsController::class, 'teamStats'])
        ->middleware('role_or_permission:admin|view own statistics|view global statistics');

    // ✅ Reference options pour admin + shift leader
    Route::get('/reference-options', [ProductReferenceController::class, 'searchOptions'])
        ->middleware('role_or_permission:admin|calculate own efficiency|calculate efficiency');

    // Admin only
    Route::middleware('role:admin')->group(function () {

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{user}', [UserController::class, 'update']);
        Route::patch('/users/{user}/status', [UserController::class, 'updateStatus']);
        Route::patch('/users/{user}/password', [UserController::class, 'updatePassword']);

        // Teams
        Route::apiResource('teams', TeamController::class);

        // References CRUD admin only
        Route::apiResource('product-references', ProductReferenceController::class);
        // Suppression de l’historique d’efficience par équipe et période
        Route::delete('/efficiency-histories', [EfficiencyHistoryController::class, 'destroyByTeams']);
    });
});