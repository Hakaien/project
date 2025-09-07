<?php

namespace App\Factory;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Validator\Constraints\UserPassword;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<User>
 */
final class UserFactory extends PersistentProxyObjectFactory
{

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    )
    {
        parent::__construct();
    }

    public static function class(): string
    {
        return User::class;
    }

    protected function defaults(): array|callable
    {
        return [
            'email' => self::faker()->text(180),
            'isVerified' => self::faker()->boolean(),
            'password' => self::faker()->text(),
            'roles' => [],
            'twoFactorEnabled' => self::faker()->boolean(),
        ];
    }

    protected function initialize(): static
    {
        return $this
            ->afterInstantiate(function(User $user): void {
                if (!str_starts_with($user->getPassword(), '$2y$')) {
                    $hashedPassword = $this->passwordHasher->hashPassword($user, $user->getPassword());
                    $user->setPassword($hashedPassword);
                }
            })
        ;
    }
}
