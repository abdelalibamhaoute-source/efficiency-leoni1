<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_references', function (Blueprint $table) {
            $table->id();

            // Code référence unique
            $table->string('code')->unique();

            // Temps gamme stocké avec précision décimale
            $table->decimal('gamme_time', 8, 2);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_references');
    }
};