<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $teams = [
            ['name' => 'ligne 01', 'is_active' => true],
            ['name' => 'ligne 02', 'is_active' => true],
            ['name' => 'ligne 03', 'is_active' => true],
            ['name' => 'ligne 04', 'is_active' => true],
            ['name' => 'ligne 06', 'is_active' => true],
            ['name' => 'caroussel 2', 'is_active' => true],
            ['name' => 'caroussel 1', 'is_active' => true],
           
        ];

        foreach ($teams as $team) {
            Team::firstOrCreate(
                ['name' => $team['name']],
                ['is_active' => $team['is_active']]
            );
        }
    }
}