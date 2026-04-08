<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            TeamSeeder::class,
            ProductReferenceSeeder::class,
            AdminUserSeeder::class,
            ShiftLeaderSeeder::class,
        ]);
    }
}