<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private EmailService $emailService
    ) {}

    #[Route('/users', name: 'admin_create_user', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['email']) || !isset($data['firstName']) || !isset($data['lastName'])) {
            return new JsonResponse(['error' => 'Email, firstName et lastName sont requis'], 400);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Un utilisateur avec cet email existe déjà'], 409);
        }

        // Créer le nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setRoles(['ROLE_USER']);
        $user->setIsVerified(false);
        $user->setIsPasswordSet(false);

        // Générer un token de réinitialisation de mot de passe
        $resetToken = bin2hex(random_bytes(32));
        $user->setPasswordResetToken($resetToken);
        $user->setPasswordResetExpiresAt(new \DateTime('+24 hours'));

        // Sauvegarder l'utilisateur
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Envoyer l'email d'invitation
        try {
            $this->emailService->sendUserInvitation($user, $resetToken);
        } catch (\Exception $e) {
            // Log l'erreur mais ne pas faire échouer la création
            error_log('Erreur envoi email invitation: ' . $e->getMessage());
        }

        return new JsonResponse([
            'message' => 'Utilisateur créé avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'isPasswordSet' => $user->isPasswordSet(),
                'isVerified' => $user->isVerified()
            ]
        ], 201);
    }

    #[Route('/users', name: 'admin_list_users', methods: ['GET'])]
    public function listUsers(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();
        
        $usersData = array_map(function (User $user) {
            return [
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
            ];
        }, $users);

        return new JsonResponse(['users' => $usersData]);
    }

    #[Route('/users/{id}', name: 'admin_get_user', methods: ['GET'])]
    public function getUser(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
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

    #[Route('/users/{id}', name: 'admin_update_user', methods: ['PUT'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès']);
    }

    #[Route('/users/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur supprimé avec succès']);
    }
}
