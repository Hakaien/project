<?php
namespace App\DataFixtures\Users;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface
{
    public static function getGroups(): array
    {
        return ['all_users']; // Groupe pour charger admin + users ensemble
    }

    public function getDependencies(): array
    {
        return [
            AdminFixtures::class,
            RegularUsersFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        // Cette fixture orchestre seulement les autres
        // Elle permet de charger admin + users avec --group=all_users
        
        echo "✅ Tous les utilisateurs ont été chargés avec succès!\n";
        echo "📋 Comptes disponibles:\n";
        
        // Les références sont disponibles depuis les fixtures dépendantes :
        // $admin = $this->getReference(AdminFixtures::ADMIN_USER_REFERENCE);
        // $user = $this->getReference(RegularUsersFixtures::REGULAR_USERS_REFERENCE);
    }
}