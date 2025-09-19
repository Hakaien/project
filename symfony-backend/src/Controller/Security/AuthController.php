<?php

namespace App\Controller\Security;

use App\Entity\User;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private EmailService $emailService
    ) {}

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

    #[Route('/profile', name: 'api_auth_profile', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'isPasswordSet' => $user->isPasswordSet(),
            'isVerified' => $user->isVerified(),
            'twoFactorEnabled' => $user->isTwoFactorEnabled(),
            'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            'lastLogin' => $user->getLastLogin()?->format('Y-m-d H:i:s')
        ]);
    }

    #[Route('/set-password', name: 'api_auth_set_password', methods: ['POST'])]
    public function setPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['token']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Token et mot de passe requis'], 400);
        }

        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy(['passwordResetToken' => $data['token']]);

        if (!$user) {
            return new JsonResponse(['error' => 'Token invalide'], 400);
        }

        if ($user->getPasswordResetExpiresAt() < new \DateTime()) {
            return new JsonResponse(['error' => 'Token expiré'], 400);
        }

        if ($user->isPasswordSet()) {
            return new JsonResponse(['error' => 'Le mot de passe a déjà été défini'], 400);
        }

        // Définir le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        $user->setIsPasswordSet(true);
        $user->setPasswordResetToken(null);
        $user->setPasswordResetExpiresAt(null);

        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Mot de passe défini avec succès']);
    }

    #[Route('/setup-2fa', name: 'api_auth_setup_2fa', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function setup2FA(Request $request): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        if (!$user->isPasswordSet()) {
            return new JsonResponse(['error' => 'Le mot de passe doit être défini avant de configurer la 2FA'], 400);
        }

        $data = json_decode($request->getContent(), true);
        $method = $data['method'] ?? null;

        if (!in_array($method, ['email', 'totp', 'google'])) {
            return new JsonResponse(['error' => 'Méthode 2FA invalide'], 400);
        }

        // Activer la 2FA selon la méthode choisie
        $user->setTwoFactorEnabled(true);
        
        if ($method === 'totp') {
            // Générer un secret TOTP
            $secret = $this->generateTotpSecret();
            $user->setTotpSecret($secret);
        } elseif ($method === 'google') {
            // Générer un secret Google Authenticator
            $secret = $this->generateGoogleSecret();
            $user->setGoogleAuthenticatorSecret($secret);
        }

        $this->entityManager->flush();

        // Envoyer l'email de confirmation
        try {
            $this->emailService->sendPasswordConfirmation($user, $method);
        } catch (\Exception $e) {
            error_log('Erreur envoi email confirmation: ' . $e->getMessage());
        }

        return new JsonResponse([
            'message' => '2FA configurée avec succès',
            'method' => $method,
            'secret' => $method === 'totp' ? $user->getTotpSecret() : 
                       ($method === 'google' ? $user->getGoogleAuthenticatorSecret() : null)
        ]);
    }

    #[Route('/forgot-password', name: 'api_auth_forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email'])) {
            return new JsonResponse(['error' => 'Email requis'], 400);
        }

        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if (!$user) {
            // Ne pas révéler si l'email existe ou non
            return new JsonResponse(['message' => 'Si cet email existe, un lien de réinitialisation a été envoyé']);
        }

        // Générer un token de réinitialisation
        $resetToken = bin2hex(random_bytes(32));
        $user->setPasswordResetToken($resetToken);
        $user->setPasswordResetExpiresAt(new \DateTime('+1 hour'));

        $this->entityManager->flush();

        // Envoyer l'email de réinitialisation
        try {
            $this->emailService->sendPasswordReset($user, $resetToken);
        } catch (\Exception $e) {
            error_log('Erreur envoi email reset: ' . $e->getMessage());
        }

        return new JsonResponse(['message' => 'Si cet email existe, un lien de réinitialisation a été envoyé']);
    }

    private function generateTotpSecret(): string
    {
        // Générer un secret TOTP de 32 caractères
        return base32_encode(random_bytes(20));
    }

    private function generateGoogleSecret(): string
    {
        // Générer un secret Google Authenticator de 32 caractères
        return base32_encode(random_bytes(20));
    }
}

// Fonction utilitaire pour l'encodage base32
if (!function_exists('base32_encode')) {
    function base32_encode($data) {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $output = '';
        $v = 0;
        $vbits = 0;
        
        for ($i = 0, $j = strlen($data); $i < $j; $i++) {
            $v <<= 8;
            $v += ord($data[$i]);
            $vbits += 8;
            
            while ($vbits >= 5) {
                $vbits -= 5;
                $output .= $alphabet[$v >> $vbits];
                $v &= ((1 << $vbits) - 1);
            }
        }
        
        if ($vbits > 0) {
            $v <<= (5 - $vbits);
            $output .= $alphabet[$v];
        }
        
        return $output;
    }
}