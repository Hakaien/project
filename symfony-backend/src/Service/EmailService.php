<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class EmailService
{
    public function __construct(
        private MailerInterface $mailer,
        private Environment $twig
    ) {}

    public function sendUserInvitation(User $user, string $resetToken): void
    {
        $email = (new Email())
            ->from('noreply@monapp.com')
            ->to($user->getEmail())
            ->subject('Invitation à rejoindre l\'application')
            ->html($this->twig->render('emails/user_invitation.html.twig', [
                'user' => $user,
                'resetToken' => $resetToken,
                'resetUrl' => $_ENV['FRONTEND_URL'] ?? 'http://localhost:4200' . '/set-password?token=' . $resetToken
            ]));

        $this->mailer->send($email);
    }

    public function sendPasswordConfirmation(User $user, string $twoFactorMethod): void
    {
        $email = (new Email())
            ->from('noreply@monapp.com')
            ->to($user->getEmail())
            ->subject('Configuration de votre compte terminée')
            ->html($this->twig->render('emails/password_confirmation.html.twig', [
                'user' => $user,
                'twoFactorMethod' => $twoFactorMethod
            ]));

        $this->mailer->send($email);
    }

    public function sendPasswordReset(User $user, string $resetToken): void
    {
        $email = (new Email())
            ->from('noreply@monapp.com')
            ->to($user->getEmail())
            ->subject('Réinitialisation de votre mot de passe')
            ->html($this->twig->render('emails/password_reset.html.twig', [
                'user' => $user,
                'resetToken' => $resetToken,
                'resetUrl' => $_ENV['FRONTEND_URL'] ?? 'http://localhost:4200' . '/reset-password?token=' . $resetToken
            ]));

        $this->mailer->send($email);
    }
}
