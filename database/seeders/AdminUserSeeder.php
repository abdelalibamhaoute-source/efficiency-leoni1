<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@leoni.local'],
            [
                'name' => 'Administrateur LEONI',
                'password' => 'Admin@12345',
                'role' => 'admin',
                'team_id' => null,
                'is_active' => true,
            ]
        );

        // Attribution du rôle Spatie
        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
    }
}