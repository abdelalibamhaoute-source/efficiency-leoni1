<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('efficiency_history_references', function (Blueprint $table) {
            $table->id();

            $table->foreignId('efficiency_history_id')
                ->constrained('efficiency_histories')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('product_reference_id')
                ->constrained('product_references')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Quantité propre à cette référence
            $table->unsignedInteger('quantity');

            // Temps gamme de la référence au moment du calcul
            $table->decimal('gamme_time', 8, 2);

            // quantity x gamme_time
            $table->decimal('subtotal_gamme_time', 12, 2);

            $table->timestamps();

            $table->index(['efficiency_history_id', 'product_reference_id'], 'ehr_history_reference_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('efficiency_history_references');
    }
};