<?php

namespace App\Support;

use Illuminate\Http\Request;

class E2ETestMode
{
    public const HEADER = 'X-DuckieTV-E2E';

    public static function enabled(?Request $request = null): bool
    {
        $request ??= request();

        return $request instanceof Request
            && $request->headers->get(self::HEADER) === '1';
    }
}
