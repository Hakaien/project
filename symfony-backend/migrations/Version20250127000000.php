<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration pour ajouter les champs nécessaires au workflow de création d'utilisateur
 */
final class Version20250127000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout des champs pour le workflow de création d\'utilisateur (passwordResetToken, passwordResetExpiresAt, isPasswordSet, firstName, lastName)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE users ADD password_reset_token VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE users ADD password_reset_expires_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE users ADD is_password_set TINYINT(1) NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE users ADD first_name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE users ADD last_name VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE users DROP password_reset_token');
        $this->addSql('ALTER TABLE users DROP password_reset_expires_at');
        $this->addSql('ALTER TABLE users DROP is_password_set');
        $this->addSql('ALTER TABLE users DROP first_name');
        $this->addSql('ALTER TABLE users DROP last_name');
    }
}
