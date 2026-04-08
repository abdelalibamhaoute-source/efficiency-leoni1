<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestAccessController extends Controller
{
    /**
     * Test endpoint admin only.
     */
    public function adminOnly(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Accès admin autorisé.',
            'user' => $request->user()->only(['id', 'name', 'email', 'role']),
        ]);
    }

    /**
     * Test endpoint shift leader only.
     */
    public function shiftLeaderOnly(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Accès shift leader autorisé.',
            'user' => $request->user()->only(['id', 'name', 'email', 'role']),
        ]);
    }
}