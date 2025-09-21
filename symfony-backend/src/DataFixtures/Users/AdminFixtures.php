<?php
namespace App\DataFixtures\Users;

use App\Entity\User;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class AdminFixtures extends Fixture implements FixtureGroupInterface
{
    public const ADMIN_USER_REFERENCE = 'admin-user';
    private const ADMIN_EMAIL = 'admin@test.com';

    public static function getGroups(): array
    {
        return ['admin'];
    }

    public function load(ObjectManager $manager): void
    {
        echo "🔍 DEBUG - Recherche admin existant avec email: " . self::ADMIN_EMAIL . "\n";
        
        // Vérifier si l'admin existe déjà
        $repository = $manager->getRepository(User::class);
        $existingAdmin = $repository->findOneBy(['email' => self::ADMIN_EMAIL]);

        if ($existingAdmin) {
            echo "✅ DEBUG - Admin existant trouvé, mise à jour...\n";
            
            // Mettre à jour l'admin existant
            $this->updateExistingAdmin($existingAdmin);
            $manager->flush();
            $admin = $existingAdmin;
            
            echo "✅ Admin existant mis à jour: " . self::ADMIN_EMAIL . "\n";
        } else {
            echo "🆕 DEBUG - Aucun admin trouvé, création en cours...\n";
            
            // Créer un nouvel admin - VERSION CORRIGÉE
            $adminProxy = UserFactory::new()->admin()->create();
            $admin = $adminProxy->_real();
            
            // Flush explicite pour être sûr
            $manager->persist($admin);
            $manager->flush();
            
            echo "🆕 Nouvel admin créé: " . self::ADMIN_EMAIL . "\n";
            echo "🔍 DEBUG - Admin roles: " . json_encode($admin->getRoles()) . "\n";
        }

        // Ajouter une référence pour d'autres fixtures
        $this->addReference(self::ADMIN_USER_REFERENCE, $admin);
        
        echo "📋 DEBUG - Référence admin ajoutée\n";
    }

    private function updateExistingAdmin(User $admin): void
    {
        echo "🔧 DEBUG - Mise à jour des propriétés admin...\n";
        
        // Mettre à jour les propriétés requises
        $admin->setIsVerified(true);
        $admin->setIsPasswordSet(true);
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setTwoFactorEnabled(false);
        
        // Note: On ne change pas le mot de passe ici car il est géré par UserFactory
        // Si vous voulez forcer un nouveau mot de passe, décommentez les lignes suivantes:
        /*
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'Admin123!');
        $admin->setPassword($hashedPassword);
        */
        
        echo "🔧 DEBUG - Propriétés admin mises à jour\n";
    }
}