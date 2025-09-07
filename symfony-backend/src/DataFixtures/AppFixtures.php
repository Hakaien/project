<?php

namespace App\DataFixtures;

use App\Tests\Fixtures\TestUserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    )
    {}

    public function load(ObjectManager $manager): void
    {
        // Crée un admin
        TestUserFactory::new($this->passwordHasher)
            ->asAdmin()
            ->create();

        // Crée 5 utilisateurs avec 2FA TOTP
        TestUserFactory::new($this->passwordHasher)
            ->withTwoFactor('totp')
            ->createMany(5);

        $manager->flush();
    }
}
