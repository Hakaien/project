<?php

namespace App\Tests\Functional\User;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserCreationTest extends WebTestCase
{
    public function testUserFactoryCreatesUser()
    {
        self::bootKernel();

        $user = UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'roles' => ['ROLE_USER'],
            'isVerified' => true,
        ]);

        $this->assertSame('test@example.com', $user->getEmail());
        $this->assertTrue($user->isVerified());
        $this->assertContains('ROLE_USER', $user->getRoles());
    }
}
