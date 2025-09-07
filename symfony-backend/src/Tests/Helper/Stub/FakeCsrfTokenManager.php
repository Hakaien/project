<?php

namespace App\Tests\Helper\Stub;

class FakeCsrfTokenManager
{
    public function isTokenValid($token)
    {
        return true;
    }
}