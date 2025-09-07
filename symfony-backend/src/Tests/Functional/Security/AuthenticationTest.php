<?php

namespace App\Tests\Functional\Security;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthenticationTest extends WebTestCase
{
    public function testLoginReturnsJwt()
    {
        $client = static::createClient();

        // Création user avec Factory
        $user = UserFactory::createOne([
            'email' => 'login@test.com',
            'password' => 'Password123!',
            'isVerified' => true,
        ]);

        $client->jsonRequest('POST', '/api/login_check', [
            'username' => 'login@test.com',
            'password' => 'Password123!',
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $client->getResponse()->toArray());
    }

    public function testLoginWith2FA()
    {
        $client = static::createClient();

        $user = UserFactory::createOne([
            'email' => '2fa@test.com',
            'password' => 'Password123!',
            'isVerified' => true,
            'twoFactorEnabled' => true,
            'totpSecret' => 'BASE32SECRET',
        ]);

        // Étape 1 → login avec email/pass
        $client->jsonRequest('POST', '/api/login_check', [
            'username' => '2fa@test.com',
            'password' => 'Password123!',
        ]);

        $this->assertResponseStatusCodeSame(200);

        // Étape 2 → envoi du code TOTP
        $totpCode = (new \OTPHP\TOTP($user->getTotpSecret()))->now();

        $client->jsonRequest('POST', '/api/2fa_check', [
            'code' => $totpCode,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $client->getResponse()->toArray());
    }

}
