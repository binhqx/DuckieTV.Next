<?php

namespace App\Console\Commands\DuckieTV;

use App\Models\Episode;
use App\Models\Season;
use App\Models\Serie;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class E2EPrepareCommand extends Command
{
    protected $signature = 'duckietv:e2e:prepare';

    protected $description = 'Prepare a clean local dataset for Playwright E2E runs';

    public function handle(): int
    {
        Episode::query()->delete();
        Season::query()->delete();
        Serie::query()->delete();

        Cache::flush();

        settings('torrenting.enabled', true);
        settings('torrenting.client', 'Transmission');
        settings('torrenting.autodownload', false);
        settings('transmission.server', 'http://transmission.invalid');
        settings('transmission.port', 80);
        settings('transmission.path', '/transmission/rpc');
        settings('transmission.use_auth', false);
        settings('transmission.username', null);
        settings('transmission.password', null);

        $this->info('DuckieTV E2E environment prepared.');

        return self::SUCCESS;
    }
}
