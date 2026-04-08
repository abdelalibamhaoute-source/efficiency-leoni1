<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage cache permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Dashboard / statistiques
            'view global dashboard',
            'view own dashboard',
            'view global statistics',
            'view own statistics',
            'view all histories',
            'view own histories',

            // Teams
            'manage teams',

            // References
            'manage references',

            // Efficiency
            'calculate efficiency',
            'calculate own efficiency',

            // Users / configuration
            'manage users',
            'change own password',
            'change users password',
            'activate deactivate users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'sanctum',
            ]);
        }

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'sanctum',
        ]);

        $shiftLeaderRole = Role::firstOrCreate([
            'name' => 'shift_leader',
            'guard_name' => 'sanctum',
        ]);

        // Admin: accès complet
        $adminRole->syncPermissions($permissions);

        // Shift leader: accès limité
        $shiftLeaderRole->syncPermissions([
            'view own dashboard',
            'view own statistics',
            'view own histories',
            'calculate own efficiency',
            'change own password',
        ]);
    }
}