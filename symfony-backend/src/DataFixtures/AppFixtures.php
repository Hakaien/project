<?php
namespace App\DataFixtures;

use App\DataFixtures\Users\UserFixtures;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface
{
    public static function getGroups(): array
    {
        return ['app']; // Groupe pour charger toute l'application
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        // Cette fixture peut charger d'autres données qui dépendent des utilisateurs
        // Par exemple : des posts, des catégories, etc.
        
        echo "🚀 Application initialisée avec succès!\n";
        echo "📊 Données chargées:\n";
        
        // Exemple d'utilisation des références créées par les autres fixtures :
        // $admin = $this->getReference(AdminFixtures::ADMIN_USER_REFERENCE);
        // $regularUser = $this->getReference(RegularUsersFixtures::REGULAR_USERS_REFERENCE . '_1');
        
        // TODO: Ajouter ici d'autres fixtures pour posts, categories, etc.
    }
}