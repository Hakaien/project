<?php
namespace App\Factory;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<User>
 */
final class UserFactory extends PersistentProxyObjectFactory
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    public static function class(): string
    {
        return User::class;
    }

    protected function defaults(): array
    {
        return [
            'email' => self::faker()->unique()->safeEmail(),
            'isVerified' => true,
            'password' => 'User123!',
            'roles' => ['ROLE_USER'],
            'twoFactorEnabled' => false,
            'isPasswordSet' => true,
            'createdAt' => new \DateTime(),
        ];
    }

    protected function initialize(): static
    {
        return $this
            ->afterInstantiate(function(User $user): void {
                // Hash le mot de passe s'il n'est pas déjà hashé
                if (!str_starts_with($user->getPassword(), '$2y$')) {
                    $hashedPassword = $this->passwordHasher->hashPassword($user, $user->getPassword());
                    $user->setPassword($hashedPassword);
                }
            });
    }

    /**
     * Créer un utilisateur admin
     */
    public function admin(): self
    {
        return $this->with([
            'email' => 'admin@test.com',
            'roles' => ['ROLE_ADMIN'],
            'password' => 'Admin123!',
            'isVerified' => true,
            'twoFactorEnabled' => false,
            'isPasswordSet' => true,
        ]);
    }

    /**
     * Créer un utilisateur standard
     */
    public function standardUser(int $number = null): self
    {
        $email = $number ? "user{$number}@test.com" : self::faker()->unique()->safeEmail();
        
        return $this->with([
            'email' => $email,
            'roles' => ['ROLE_USER'],
            'password' => 'User123!',
            'isVerified' => true,
            'twoFactorEnabled' => false,
            'isPasswordSet' => true,
        ]);
    }

    /**
     * Créer un utilisateur avec 2FA activé
     */
    public function withTwoFactor(string $type = 'totp'): self
    {
        $attributes = ['twoFactorEnabled' => true];
        
        if ($type === 'totp') {
            $attributes['totpSecret'] = bin2hex(random_bytes(10));
        }
        
        return $this->with($attributes);
    }
}