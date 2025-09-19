<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/2fa')]
class TwoFactorController extends AbstractController
{
    #[Route('/status', name: 'api_2fa_status', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function status(): JsonResponse
    {
        $user = $this->getUser();
        
        return new JsonResponse([
            'isTwoFactorEnabled' => $user->isTwoFactorEnabled(),
            'isEmailAuthEnabled' => $user->isEmailAuthEnabled(),
            'isTotpEnabled' => $user->isTotpAuthenticationEnabled(),
            'isGoogleAuthenticatorEnabled' => $user->isGoogleAuthenticatorEnabled()
        ]);
    }

    #[Route('/disable', name: 'api_2fa_disable', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function disable(): JsonResponse
    {
        $user = $this->getUser();
        
        // Désactiver la 2FA
        $user->setTwoFactorEnabled(false);
        $user->setTotpSecret(null);
        $user->setGoogleAuthenticatorSecret(null);
        
        $this->getDoctrine()->getManager()->flush();
        
        return new JsonResponse(['message' => '2FA désactivée avec succès']);
    }
}
