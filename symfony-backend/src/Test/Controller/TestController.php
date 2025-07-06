<?php

namespace App\Test\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use App\Test\Dto\TestUserDto;

class TestController
{
    public function apiTest(Request $request, CsrfTokenManagerInterface $csrfTokenManager)
    {
        $token = $request->headers->get('X-CSRF-TOKEN');
        if (!$csrfTokenManager->isTokenValid(new CsrfToken('api', $token))) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $userDto = new TestUserDto('testuser', 'test@example.com');
        return new JsonResponse($userDto);
    }
}