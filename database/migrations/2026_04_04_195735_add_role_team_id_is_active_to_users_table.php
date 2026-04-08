<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // admin / shift_leader
            $table->string('role', 50)->default('shift_leader')->after('password');

            // Un shift leader peut être rattaché à une équipe
            $table->foreignId('team_id')
                ->nullable()
                ->after('role')
                ->constrained('teams')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // Activer / désactiver un compte
            $table->boolean('is_active')->default(true)->after('team_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_id');
            $table->dropColumn(['role', 'is_active']);
        });
    }
};