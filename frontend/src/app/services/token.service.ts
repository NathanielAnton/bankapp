import { Injectable } from '@angular/core';

export interface DecodedToken {
  role: string;
  sub: string; 
  id: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return this.decodeToken(token);
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e);
      return null;
    }
  }

  getRole(): string | null {
    return this.getDecodedToken()?.role || null;
  }

  getUsername(): string | null {
    return this.getDecodedToken()?.sub || null;
  }

  getUserId(): number | null {
    return this.getDecodedToken()?.id || null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return true;
    
    // Convertir le timestamp UNIX en millisecondes et comparer avec la date actuelle
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  getTokenExpiration(): Date | null {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  }

  // Méthode principale de décodage du token JWT
  private decodeToken(token: string): DecodedToken {
    // Vérifier que le token a le bon format JWT (3 parties séparées par des points)
    if (!token || typeof token !== 'string') {
      throw new Error('Token invalide');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Format JWT invalide');
    }

    // La payload est la deuxième partie du token
    const payload = parts[1];
    
    // Convertir base64url en base64 standard
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Ajouter le padding si nécessaire
    switch (base64.length % 4) {
      case 0:
        break;
      case 2:
        base64 += '==';
        break;
      case 3:
        base64 += '=';
        break;
      default:
        throw new Error('Base64 string incorrecte');
    }

    // Décoder base64 et parser le JSON
    try {
      const decodedJson = this.base64Decode(base64);
      const parsedToken = JSON.parse(decodedJson);
      
      // Valider que le token a les propriétés attendues
      if (!parsedToken.sub || !parsedToken.role || !parsedToken.id || !parsedToken.exp) {
        throw new Error('Token JWT malformé - propriétés manquantes');
      }
      
      return parsedToken as DecodedToken;
    } catch (error) {
      throw new Error('Erreur lors du parsing du token: ' + error);
    }
  }

  // Méthode pour décoder base64 de manière sécurisée
  private base64Decode(base64: string): string {
    try {
      // Utiliser atob pour décoder base64
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map(char => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (error) {
      // Fallback simple si la méthode complexe échoue
      return atob(base64);
    }
  }
}