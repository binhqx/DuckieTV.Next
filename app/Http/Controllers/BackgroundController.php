<?php

namespace App\Http\Controllers;

use App\Services\FavoritesService;

class BackgroundController extends Controller
{
    protected FavoritesService $favorites;

    public function __construct(FavoritesService $favorites)
    {
        $this->favorites = $favorites;
    }

    /**
     * Get a random favorite show with fanart.
     * Used by the background rotator in the frontend.
     */
    public function getRandom()
    {
        $serie = $this->favorites->getRandomBackground();

        if (! $serie) {
            // No background candidates yet (e.g. fresh install with no favorites).
            // Return 204 so clients can treat this as "nothing to rotate" instead of an error.
            return response()->noContent();
        }

        return response()->json([
            'id' => $serie->id,
            'name' => $serie->name,
            'fanart' => $serie->fanart,
            'year' => $serie->firstaired->year,
        ]);
    }
}
