<?php

namespace App\Tests\Fixtures;

use App\Entity\User;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

/**
 * @extends PersistentProxyObjectFactory<User>
 */
final class TestUserFactory extends PersistentProxyObjectFactory
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->passwordHasher = $passwordHasher;
    }

    // Obligatoire pour PersistentProxyObjectFactory
    public static function class(): string
    {
        return User::class;
    }

    // Valeurs par défaut
    protected function defaults(): array
    {
        $faker = Factory::create('fr_FR');

        return [
            'email' => $faker->unique()->safeEmail(),
            'roles' => ['ROLE_USER'],
            'password' => function(array $attributes) {
                // On crée un user temporaire juste pour le hasher
                $user = new User();
                return $this->passwordHasher->hashPassword($user, 'User123!');
            },
            'isVerified' => true,
            'twoFactorEnabled' => false,
            'createdAt' => new \DateTime(),
        ];
    }

    /**
     * Permet d’activer la 2FA pour ce user (totp, email ou google)
     */
    public function withTwoFactor(string $type = 'totp', ?string $secret = null): self
    {
        $this->addState(function(array $attributes) use ($type, $secret) {
            $attributes['twoFactorEnabled'] = true;

            if ($type === 'totp') {
                $attributes['totpSecret'] = $secret ?? bin2hex(random_bytes(10));
            } elseif ($type === 'email') {
                $attributes['authCode'] = random_int(100000, 999999);
            } elseif ($type === 'google') {
                $attributes['googleAuthenticatorSecret'] = $secret ?? bin2hex(random_bytes(10));
            }

            return $attributes;
        });

        return $this;
    }
}
