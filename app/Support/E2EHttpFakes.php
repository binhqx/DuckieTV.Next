<?php

namespace App\Support;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

class E2EHttpFakes
{
    private ?array $fixtures = null;

    public function enable(): void
    {
        Http::preventStrayRequests();
        Http::fake(fn (Request $request) => $this->fake($request));
    }

    private function fake(Request $request): mixed
    {
        $url = $request->url();
        $host = parse_url($url, PHP_URL_HOST) ?? '';
        $path = parse_url($url, PHP_URL_PATH) ?? '';
        $query = [];
        parse_str(parse_url($url, PHP_URL_QUERY) ?? '', $query);

        if ($host === 'api.trakt.tv') {
            return $this->fakeTrakt($path, $query);
        }

        if ($host === 'api.themoviedb.org') {
            return $this->fakeTmdb($path);
        }

        if (str_ends_with($path, '/transmission/rpc')) {
            return $this->fakeTransmission($request);
        }

        throw new \RuntimeException("No E2E fake registered for external request: {$url}");
    }

    private function fakeTrakt(string $path, array $query): mixed
    {
        $fixtures = $this->fixtures();

        if ($path === '/shows/trending') {
            return Http::response($fixtures['trakt']['trending']);
        }

        if ($path === '/search/show') {
            $needle = strtolower((string) ($query['query'] ?? ''));
            $results = $fixtures['trakt']['search']['default'];

            if (str_contains($needle, 'academy')) {
                $results = $fixtures['trakt']['search']['academy'];
            } elseif (str_contains($needle, 'strange')) {
                $results = $fixtures['trakt']['search']['strange'];
            }

            return Http::response($results);
        }

        if (preg_match('#^/shows/(\d+)/people$#', $path, $matches)) {
            return Http::response($fixtures['trakt']['people'][$matches[1]] ?? ['cast' => []]);
        }

        if (preg_match('#^/shows/(\d+)/seasons/(\d+)/episodes$#', $path, $matches)) {
            return Http::response($fixtures['trakt']['episodes'][$matches[1]][$matches[2]] ?? []);
        }

        if (preg_match('#^/shows/(\d+)/seasons$#', $path, $matches)) {
            return Http::response($fixtures['trakt']['seasons'][$matches[1]] ?? []);
        }

        if (preg_match('#^/shows/(\d+)$#', $path, $matches)) {
            return Http::response($fixtures['trakt']['shows'][$matches[1]] ?? [], isset($fixtures['trakt']['shows'][$matches[1]]) ? 200 : 404);
        }

        return Http::response(['error' => "Unhandled Trakt path {$path}"], 404);
    }

    private function fakeTmdb(string $path): mixed
    {
        $fixtures = $this->fixtures();

        if (preg_match('#^/3/tv/(\d+)$#', $path, $matches)) {
            return Http::response($fixtures['tmdb'][$matches[1]] ?? [
                'poster_path' => null,
                'backdrop_path' => null,
            ]);
        }

        return Http::response(['status_message' => "Unhandled TMDB path {$path}"], 404);
    }

    private function fakeTransmission(Request $request): mixed
    {
        $payload = json_decode($request->body(), true) ?? [];
        $method = $payload['method'] ?? 'unknown';
        $fixtures = $this->fixtures()['transmission'];

        return Http::response($fixtures[$method] ?? [
            'result' => 'success',
            'arguments' => [],
        ]);
    }

    private function fixtures(): array
    {
        if ($this->fixtures !== null) {
            return $this->fixtures;
        }

        $path = base_path('tests/Fixtures/e2e/http-fixtures.json');
        $data = json_decode(file_get_contents($path), true);

        if (! is_array($data)) {
            throw new \RuntimeException("Invalid E2E fixtures file: {$path}");
        }

        $this->fixtures = $data;

        return $this->fixtures;
    }
}
