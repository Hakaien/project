<?php
namespace App\DataFixtures\Users;

use App\Entity\User;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class RegularUsersFixtures extends Fixture implements FixtureGroupInterface
{
    public const REGULAR_USERS_REFERENCE = 'regular-users';
    private const NUMBER_OF_USERS = 5;

    public static function getGroups(): array
    {
        return ['users'];
    }

    public function load(ObjectManager $manager): void
    {
        $repository = $manager->getRepository(User::class);
        $createdUsers = [];

        // Créer ou mettre à jour 5 comptes users pour les tests
        for ($i = 1; $i <= self::NUMBER_OF_USERS; $i++) {
            $email = "user{$i}@test.com";
            $existingUser = $repository->findOneBy(['email' => $email]);

            if ($existingUser) {
                // Mettre à jour l'utilisateur existant
                $this->updateExistingUser($existingUser);
                $manager->flush();
                $user = $existingUser;
                
                echo "✅ Utilisateur existant mis à jour: {$email}\n";
            } else {
                // Créer un nouvel utilisateur
                $user = UserFactory::new()
                    ->standardUser($i)
                    ->createOne()
                    ->_real();
                    
                echo "🆕 Nouvel utilisateur créé: {$email}\n";
            }

            $createdUsers[] = $user;
            
            // Ajouter une référence pour chaque utilisateur
            $this->addReference(self::REGULAR_USERS_REFERENCE . '_' . $i, $user);
        }
        
        // Référence générale pour le premier user - CORRECTION de la syntaxe
        if (!empty($createdUsers)) {
            $this->addReference(self::REGULAR_USERS_REFERENCE, $createdUsers[0]);
        }
    }

    private function updateExistingUser(User $user): void
    {
        // Mettre à jour les propriétés si nécessaire
        $user->setIsVerified(true);
        $user->setIsPasswordSet(true);
        $user->setRoles(['ROLE_USER']);
        $user->setTwoFactorEnabled(false);
        
        // Réinitialiser le mot de passe si nécessaire
        // Note: Le password sera re-hashé par UserFactory si besoin
    }
}