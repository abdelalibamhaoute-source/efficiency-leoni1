<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShiftLeaderSeeder extends Seeder
{
    public function run(): void
    {
        $teamA = Team::where('name', 'Team A')->first();
        $teamB = Team::where('name', 'Team B')->first();

        $users = [
            [
                'name' => 'Salma',
                'email' => 'salma@leoni.local',
                'password' => 'slma@12345',
                'role' => 'shift_leader',
                'team_id' => $teamA?->id,
                'is_active' => true,
            ],
            [
                'name' => 'Shift Leader B',
                'email' => 'shift.b@leoni.local',
                'password' => 'Shift@12345',
                'role' => 'shift_leader',
                'team_id' => $teamB?->id,
                'is_active' => true,
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                $data
            );

            if (! $user->hasRole('shift_leader')) {
                $user->assignRole('shift_leader');
            }
        }
    }
}