<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Scheb\TwoFactorBundle\Model\Email\TwoFactorInterface as EmailTwoFactorInterface;
use Scheb\TwoFactorBundle\Model\Google\TwoFactorInterface as GoogleTwoFactorInterface;
use Scheb\TwoFactorBundle\Model\Totp\TwoFactorInterface as TotpTwoFactorInterface;

#[ORM\Entity]
#[ORM\Table(name: 'users')]
class User implements UserInterface, PasswordAuthenticatedUserInterface, EmailTwoFactorInterface, GoogleTwoFactorInterface, TotpTwoFactorInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(type: 'boolean')]
    private bool $isVerified = false;

    // Champs pour 2FA
    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $authCode = null;

    #[ORM\Column(type: 'boolean')]
    private bool $twoFactorEnabled = false;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $totpSecret = null;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $googleAuthenticatorSecret = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $lastLogin = null;

    public function __construct()
    {
        // Initialisation des champs
        $this->roles = [];
        $this->isVerified = false;
        $this->twoFactorEnabled = false;
        $this->createdAt = new \DateTime();
    }

    // Getters et setters standards
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Si vous stockez des données sensibles temporaires sur l'utilisateur, effacez-les ici
    }

    // |||| 2FA METHODS |||| //

    // === Méthodes pour 2FA Email (Scheb 2fa-email) ===
    /**
     * Retourne l'adresse email qui recevra le code de double authentification.
     */
    public function getEmailAuthRecipient(): string
    {
        return $this->email;
    }

    /**
     * Retourne le code d'authentification envoyé par email.
     */
    public function getEmailAuthCode(): string
    {
        return (string) $this->authCode;
    }

    /**
     * Définit le code d'authentification envoyé par email.
     */
    public function setEmailAuthCode(string $authCode): void
    {
        $this->authCode = (int) $authCode;
    }

    /**
     * Indique si la double authentification (2FA) est activée pour cet utilisateur.
     */
    public function isTwoFactorEnabled(): bool
    {
        return $this->twoFactorEnabled;
    }

    public function setTwoFactorEnabled(bool $twoFactorEnabled): void
    {
        $this->twoFactorEnabled = $twoFactorEnabled;
    }

    /**
     * Indique si la double authentification par email est activée.
     */
    public function isEmailAuthEnabled(): bool
    {
        return $this->twoFactorEnabled;
    }
    // -------------------

    // === Méthodes pour TOTP (Scheb 2fa-totp) ===
    /**
     * Indique si la double authentification TOTP (Time-based One-Time Password) est activée.
     */
    public function isTotpAuthenticationEnabled(): bool
    {
        return $this->totpSecret !== null && $this->twoFactorEnabled;
    }

    /**
     * Retourne l'identifiant utilisateur pour TOTP (souvent l'email).
     */
    public function getTotpAuthenticationUsername(): string
    {
        return $this->email;
    }

    /**
     * Retourne la configuration TOTP (Time-based One-Time Password).
     */
    public function getTotpAuthenticationConfiguration(): ?\Scheb\TwoFactorBundle\Model\Totp\TotpConfiguration
    {
        if ($this->totpSecret === null) {
            return null;
        }
        // period: 30 seconds, digits: 6, algorithm: 'sha1' are typical defaults
        return new \Scheb\TwoFactorBundle\Model\Totp\TotpConfiguration(
            $this->totpSecret,
            30, // period
            6,  // digits
            'sha1' // algorithm
        );
    }

    public function setTotpSecret(?string $totpSecret): void
    {
        $this->totpSecret = $totpSecret;
    }
    // -------------------

    // === Méthodes pour Google Authenticator (Scheb 2fa-google-authenticator) ===
    /**
     * Indique si la double authentification via Google Authenticator est activée.
     */
    public function isGoogleAuthenticatorEnabled(): bool
    {
        return $this->googleAuthenticatorSecret !== null && $this->twoFactorEnabled;
    }

    /**
     * Retourne l'identifiant utilisateur pour Google Authenticator (souvent l'email).
     */
    public function getGoogleAuthenticatorUsername(): string
    {
        return $this->email;
    }

    /**
     * Retourne la clé secrète Google Authenticator.
     */
    public function getGoogleAuthenticatorSecret(): ?string
    {
        return $this->googleAuthenticatorSecret;
    }

    public function setGoogleAuthenticatorSecret(?string $googleAuthenticatorSecret): void
    {
        $this->googleAuthenticatorSecret = $googleAuthenticatorSecret;
    }
    // ------------------- 
    // |||| 2FA END |||| //

    // Méthodes pour la gestion des dates de création et de dernière connexion
    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getLastLogin(): ?\DateTimeInterface
    {
        return $this->lastLogin;
    }

    public function setLastLogin(?\DateTimeInterface $lastLogin): void
    {
        $this->lastLogin = $lastLogin;
    }

}