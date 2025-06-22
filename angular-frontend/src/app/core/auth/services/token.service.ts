import { Injectable } from '@angular/core';
import { AuthToken, TokenModel, DecodedToken } from '../models/auth-token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_TYPE_KEY = 'token_type';
  private readonly EXPIRES_AT_KEY = 'expires_at';

  constructor() {}

  /**
   * Stocke les tokens dans le localStorage
   */
  setTokens(tokenData: AuthToken): void {
    const token = new TokenModel(tokenData);

    localStorage.setItem(this.ACCESS_TOKEN_KEY, token.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token.refreshToken);
    localStorage.setItem(this.TOKEN_TYPE_KEY, token.tokenType);
    localStorage.setItem(this.EXPIRES_AT_KEY, token.expiresAt.toISOString());
  }

  /**
   * Récupère le token d'accès
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Récupère le token de refresh
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Récupère le type de token
   */
  getTokenType(): string {
    return localStorage.getItem(this.TOKEN_TYPE_KEY) || 'Bearer';
  }

  /**
   * Récupère la date d'expiration
   */
  getExpirationDate(): Date | null {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    return expiresAt ? new Date(expiresAt) : null;
  }

  /**
   * Récupère tous les tokens sous forme d'objet TokenModel
   */
  getTokens(): TokenModel | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return new TokenModel({
      accessToken,
      refreshToken,
      tokenType: this.getTokenType(),
      expiresAt: this.getExpirationDate() || new Date()
    });
  }

  /**
   * Vérifie si un token valide existe
   */
  hasValidToken(): boolean {
    const tokens = this.getTokens();
    return tokens ? tokens.isValidToken() : false;
  }

  /**
   * Vérifie si le token est expiré
   */
  isTokenExpired(): boolean {
    const tokens = this.getTokens();
    return tokens ? tokens.isExpired() : true;
  }

  /**
   * Vérifie si le token expire bientôt (dans les 5 minutes par défaut)
   */
  isTokenExpiringSoon(thresholdSeconds: number = 300): boolean {
    const tokens = this.getTokens();
    return tokens ? tokens.isExpiringIn(thresholdSeconds) : true;
  }

  /**
   * Récupère l'en-tête d'autorisation
   */
  getAuthorizationHeader(): string | null {
    const tokens = this.getTokens();
    return tokens && tokens.isValidToken() ? tokens.getAuthorizationHeader() : null;
  }

  /**
   * Décode le JWT token (sans vérification de signature)
   */
  decodeToken(token?: string): DecodedToken | null {
    const accessToken = token || this.getAccessToken();

    if (!accessToken) {
      return null;
    }

    try {
      const payload = accessToken.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as DecodedToken;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Récupère l'ID utilisateur depuis le token
   */
  getUserIdFromToken(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.sub : null;
  }

  /**
   * Récupère l'email utilisateur depuis le token
   */
  getUserEmailFromToken(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.email : null;
  }

  /**
   * Récupère les rôles utilisateur depuis le token
   */
  getUserRolesFromToken(): string[] {
    const decoded = this.decodeToken();
    return decoded ? decoded.roles : [];
  }

  /**
   * Supprime tous les tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  /**
   * Met à jour uniquement le token d'accès (utile lors du refresh)
   */
  updateAccessToken(accessToken: string, expiresIn: number): void {
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toISOString());
  }
}
