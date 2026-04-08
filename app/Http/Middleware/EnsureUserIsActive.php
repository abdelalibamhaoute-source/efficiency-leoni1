<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Vérifie que l'utilisateur authentifié est actif.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->is_active) {
            return response()->json([
                'message' => 'Votre compte est désactivé. Veuillez contacter un administrateur.',
            ], 403);
        }

        return $next($request);
    }
}