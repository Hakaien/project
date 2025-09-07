<?php

namespace App\Tests\Fixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class TestFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;
    private TestUserFactory $userFactory;

    public function __construct(UserPasswordHasherInterface $passwordHasher, TestUserFactory $userFactory)
    {
        $this->passwordHasher = $passwordHasher;
        $this->userFactory = $userFactory;
    }

    public function load(ObjectManager $manager): void
    {
        // 🔹 Admin
        $admin = $this->userFactory->create([
            'email' => 'admin@test.com',
            'roles' => ['ROLE_ADMIN'],
            'password' => $this->passwordHasher->hashPassword(new User(), 'Admin123!'),
        ]);
        $manager->persist($admin);
        $this->addReference('admin', $admin);

        // 🔹 5 Users
        for ($i = 1; $i <= 5; $i++) {
            $user = $this->userFactory->create();
            $manager->persist($user);
            $this->addReference('user_' . $i, $user);
        }

        $manager->flush();
    }
}
