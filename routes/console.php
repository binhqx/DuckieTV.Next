<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\PruneAutoDLActivitiesJob;
use App\Services\AutoDownloadService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new PruneAutoDLActivitiesJob())->weekly();
Schedule::call(function () {
    app(AutoDownloadService::class)->check();
})->everyFifteenMinutes()->name('autodownload:check')->withoutOverlapping();
