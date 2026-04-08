<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('efficiency_histories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')
                ->constrained('teams')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Quantité totale calculée sur l'ensemble des références sélectionnées
            $table->unsignedInteger('quantity_total');

            // Nombre d'opérateurs
            $table->unsignedInteger('operator_count');

            // Temps de travail
            $table->decimal('work_time', 8, 2);

            // Somme des (quantité x gamme_time) ou somme des temps gamme retenus
            $table->decimal('total_gamme_time', 12, 2);

            // Objectif d'efficience
            $table->decimal('objective', 8, 2);

            // Valeur calculée de l'efficience
            $table->decimal('efficiency_value', 8, 2);

            // above_target / below_target
            $table->string('status', 30);

            // Date métier du calcul
            $table->dateTime('calculation_date');

            // Utilisateur ayant lancé le calcul
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->timestamps();

            $table->index(['team_id', 'calculation_date']);
            $table->index(['created_by', 'calculation_date']);
            $table->index('efficiency_value');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('efficiency_histories');
    }
};