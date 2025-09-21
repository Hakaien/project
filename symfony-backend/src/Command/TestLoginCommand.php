<?php
namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:test-login')]
class TestLoginCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['email' => 'admin@test.com']);
        
        if (!$user) {
            $output->writeln('Utilisateur non trouvé');
            return Command::FAILURE;
        }

        $output->writeln('Utilisateur trouvé: ' . $user->getEmail());
        $output->writeln('Rôles: ' . json_encode($user->getRoles()));
        $output->writeln('Vérifié: ' . ($user->isVerified() ? 'Oui' : 'Non'));

        $isPasswordValid = $this->passwordHasher->isPasswordValid($user, 'Admin123!');
        $output->writeln('Mot de passe valide: ' . ($isPasswordValid ? 'Oui' : 'Non'));

        return Command::SUCCESS;
    }
}