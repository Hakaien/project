<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Méthode interceptée par la sécurité Symfony pour gérer l'authentification.
        // Nécessaire pour que le routeur reconnaisse cette route, mais la logique d'authentification
        //  est gérée par le système de sécurité de Symfony.
        throw new \Exception('Cette méthode ne devrait jamais être appelée');
    }

    #[Route('/logout', name: 'api_auth_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Géré par le firewall
        return new JsonResponse(['message' => 'Logout successful']);
    }
}