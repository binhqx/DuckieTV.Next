<?php

namespace App\Http\Middleware;

use App\Support\E2EHttpFakes;
use App\Support\E2ETestMode;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnableE2EFakes
{
    public function __construct(private readonly E2EHttpFakes $fakes) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (E2ETestMode::enabled($request)) {
            $this->fakes->enable();
        }

        return $next($request);
    }
}
