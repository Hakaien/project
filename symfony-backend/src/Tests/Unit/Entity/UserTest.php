<?php

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testDefaultValues(): void
    {
        $user = new User();

        $this->assertContains('ROLE_USER', $user->getRoles());
        $this->assertFalse($user->isVerified());
        $this->assertFalse($user->isTwoFactorEnabled());
    }

    public function testEnable2FA(): void
    {
        $user = new User();
        $user->setTwoFactorEnabled(true);
        $this->assertTrue($user->isTwoFactorEnabled());

        $user->setTwoFactorEnabled(false);
        $this->assertFalse($user->isTwoFactorEnabled());
    }
}