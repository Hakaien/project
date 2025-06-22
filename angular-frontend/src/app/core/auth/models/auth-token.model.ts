export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
}

export interface DecodedToken {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

export class TokenModel implements AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;

  constructor(data: Partial<AuthToken>) {
    this.accessToken = data.accessToken || '';
    this.refreshToken = data.refreshToken || '';
    this.tokenType = data.tokenType || 'Bearer';
    this.expiresIn = data.expiresIn || 3600;
    this.expiresAt = data.expiresAt || new Date(Date.now() + (this.expiresIn * 1000));
  }

  isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  isValidToken(): boolean {
    return !!this.accessToken && !this.isExpired();
  }

  getAuthorizationHeader(): string {
    return `${this.tokenType} ${this.accessToken}`;
  }

  // Temps restant avant expiration en secondes
  getTimeToExpiration(): number {
    const now = new Date().getTime();
    const expiration = this.expiresAt.getTime();
    return Math.max(0, Math.floor((expiration - now) / 1000));
  }

  // Vérifie si le token expire dans les X secondes
  isExpiringIn(seconds: number): boolean {
    return this.getTimeToExpiration() <= seconds;
  }
}
