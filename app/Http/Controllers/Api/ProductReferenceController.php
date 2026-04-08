<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductReference\StoreProductReferenceRequest;
use App\Http\Requests\ProductReference\UpdateProductReferenceRequest;
use App\Models\ProductReference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductReferenceController extends Controller
{
    /**
     * Liste paginée des références avec recherche et filtre de statut.
     */
    public function index(Request $request): JsonResponse
    {
        $search = trim($request->string('search')->toString());
        $isActive = $request->query('is_active');

        $references = ProductReference::query()
            ->withCount('efficiencyHistoryReferences')
            ->when($search, function ($query) use ($search) {
                $query->where('code', 'like', "%{$search}%");
            })
            ->when($isActive !== null && $isActive !== '', function ($query) use ($isActive) {
                $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE));
            })
            ->orderBy('code')
            ->paginate(15);

        return response()->json($references);
    }

    /**
     * Créer une nouvelle référence.
     */
    public function store(StoreProductReferenceRequest $request): JsonResponse
    {
        $data = $request->validated();

        $reference = ProductReference::create([
            'code' => trim($data['code']),
            'gamme_time' => $data['gamme_time'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Référence créée avec succès.',
            'reference' => $reference,
        ], 201);
    }

    /**
     * Afficher une référence.
     */
    public function show(ProductReference $product_reference): JsonResponse
    {
        $product_reference->loadCount('efficiencyHistoryReferences');

        return response()->json([
            'reference' => $product_reference,
        ]);
    }

    /**
     * Mettre à jour une référence.
     */
    public function update(UpdateProductReferenceRequest $request, ProductReference $product_reference): JsonResponse
    {
        $data = $request->validated();

        $product_reference->update([
            'code' => trim($data['code']),
            'gamme_time' => $data['gamme_time'],
            'is_active' => $data['is_active'],
        ]);

        return response()->json([
            'message' => 'Référence mise à jour avec succès.',
            'reference' => $product_reference,
        ]);
    }

    /**
     * Supprimer une référence si elle n'est liée à aucun historique.
     */
    public function destroy(ProductReference $product_reference): JsonResponse
    {
        $usageCount = $product_reference->efficiencyHistoryReferences()->count();

        if ($usageCount > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cette référence car elle est déjà utilisée dans l’historique.',
            ], 422);
        }

        $product_reference->delete();

        return response()->json([
            'message' => 'Référence supprimée avec succès.',
        ]);
    }

    /**
     * Endpoint léger pour alimenter un select / multiselect.
     * Supporte la recherche par code complet ou par 4 derniers caractères.
     */
    public function searchOptions(Request $request): JsonResponse
    {
        $search = trim($request->string('search')->toString());

        $references = ProductReference::query()
            ->where('is_active', true)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('code', 'like', "%{$search}%");

                    // Recherche par 4 derniers caractères si l'utilisateur saisit peu de caractères
                    if (mb_strlen($search) <= 4) {
                        $subQuery->orWhereRaw('RIGHT(code, 4) LIKE ?', ["%{$search}%"]);
                    }
                });
            })
            ->orderBy('code')
            ->limit(30)
            ->get([
                'id',
                'code',
                'gamme_time',
                'is_active',
            ])
            ->map(function ($reference) {
                return [
                    'id' => $reference->id,
                    'code' => $reference->code,
                    'gamme_time' => $reference->gamme_time,
                    'label' => $reference->code . ' - TG: ' . $reference->gamme_time,
                ];
            })
            ->values();

        return response()->json([
            'references' => $references,
        ]);
    }
}