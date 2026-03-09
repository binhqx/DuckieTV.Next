<?php

namespace App\Http\Controllers;

use App\Services\FavoritesService;
use App\Services\PosterService;
use App\Services\SeriesMetaTranslations;
use App\Services\TraktService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    protected TraktService $trakt;

    protected FavoritesService $favorites;

    protected PosterService $posters;

    protected SeriesMetaTranslations $metaTranslations;

    public function __construct(TraktService $trakt, FavoritesService $favorites, PosterService $posters, SeriesMetaTranslations $metaTranslations)
    {
        $this->trakt = $trakt;
        $this->favorites = $favorites;
        $this->posters = $posters;
        $this->metaTranslations = $metaTranslations;
    }

    /**
     * Display the search page with trending shows.
     * Loads from cache or Trakt API if bundled JSON is missing/outdated.
     */
    public function index(Request $request)
    {
        $trending = $this->posters->getCached('trending');

        if (! $trending) {
            $trending = $this->loadTrending();
            if (empty($trending)) {
                $trending = $this->trakt->trending();
            }
            $trending = $this->posters->enrich($trending);
            $this->posters->cacheResults('trending', $trending);
        }

        $favoriteIds = $this->favorites->getFavoriteIds();

        if ($request->ajax()) {
            return view('search.partial', [
                'results' => $trending,
                'query' => null,
                'favoriteIds' => $favoriteIds,
            ]);
        }

        return view('search.index', [
            'results' => $trending, // Pass trending as results for the initial view
            'query' => null,
            'favoriteIds' => $favoriteIds,
        ]);
    }

    /**
     * Show a single search/trending result in the sidepanel.
     */
    public function show(string $traktId)
    {
        $show = $this->posters->getCached('show-'.$traktId);

        if (! $show) {
            $show = $this->trakt->serie($traktId);
            $show = $this->posters->enrich([$show])[0] ?? $show;
        } elseif (array_is_list($show)) {
            $show = $show[0] ?? [];
        }

        abort_if(empty($show), 404);

        $show['actors'] = collect($show['people']['cast'] ?? [])
            ->map(fn (array $credit) => $credit['person']['name'] ?? null)
            ->filter()
            ->values()
            ->all();

        $show['translated_day'] = ! empty($show['airs']['day'])
            ? $this->metaTranslations->translateDayOfWeek($show['airs']['day'])
            : null;
        $show['translated_status'] = ! empty($show['status'])
            ? $this->metaTranslations->translateStatus($show['status'])
            : null;
        $show['translated_genres'] = collect($show['genres'] ?? [])
            ->map(fn (string $genre) => $this->metaTranslations->translateGenre($genre))
            ->values()
            ->all();

        $this->posters->cacheResults('show-'.$traktId, [$show]);

        return view('search.show', [
            'show' => $show,
            'isFavorite' => in_array($show['trakt_id'] ?? null, $this->favorites->getFavoriteIds(), true),
        ]);
    }

    /**
     * Perform a search on Trakt.
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        if (empty($query)) {
            return redirect()->route('search.index');
        }

        $results = $this->posters->getCached($query);

        if (! $results) {
            $results = $this->trakt->search($query);
            $results = $this->posters->enrich($results);
            $this->posters->cacheResults($query, $results);
        }

        $favoriteIds = $this->favorites->getFavoriteIds();

        if ($request->ajax()) {
            return view('search.partial', [
                'results' => $results,
                'query' => $query,
                'favoriteIds' => $favoriteIds,
            ]);
        }

        return view('search.index', [
            'results' => $results,
            'query' => $query,
            'favoriteIds' => $favoriteIds,
        ]);
    }

    /**
     * Add a show to favorites.
     */
    public function add(Request $request)
    {
        $traktId = $request->get('trakt_id');

        try {
            $data = $this->trakt->serie($traktId);
            $serie = $this->favorites->addFavorite($data);

            return redirect()->route('calendar.index')->with('status', "Added {$serie->name} to favorites.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to add show: '.$e->getMessage());
        }
    }

    /**
     * Load the trending shows from the bundled JSON file.
     * Ported from the original DuckieTV trakt-trending-500.json.
     */
    private function loadTrending(): array
    {
        $path = storage_path('app/trakt-trending-500.json');
        if (! file_exists($path)) {
            return [];
        }

        return json_decode(file_get_contents($path), true) ?: [];
    }
}
