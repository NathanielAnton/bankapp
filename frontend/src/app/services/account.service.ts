import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountRequest {
  clientId: number;
  type: 'COURANT' | 'EPARGNE' | 'LIVRET_A' | 'LIVRET_JEUNE' | 'PEL' | 'CEL';
  solde: number;
  statut: 'ACTIF' | 'BLOQUE' | 'CLOTURE';
}

export interface Account {
  id: number;
  clientId: number;
  type: 'COURANT' | 'EPARGNE' | 'LIVRET_A' | 'LIVRET_JEUNE' | 'PEL' | 'CEL';
  solde: number;
  statut: 'ACTIF' | 'BLOQUE' | 'CLOTURE';
  dateOuverture: string;
  transactions?: any[];
  transactionsRecues?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Aucun token JWT trouvé');
      throw new Error('Authentication required');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMyAccounts(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    
    // Vérifier que le token existe
    if (!token) {
      console.error('Aucun token JWT trouvé dans le localStorage');
      console.log('Clés disponibles:', Object.keys(localStorage));
      throw new Error('Authentication required');
    }

    console.log('Token utilisé:', token); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<any[]>(`${this.apiUrl}/me`, { headers });
  }

  createAccount(accountRequest: AccountRequest): Observable<Account> {
    const headers = this.getAuthHeaders();
    return this.http.post<Account>(this.apiUrl, accountRequest, { headers });
  }

  getAccountTypeDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'COURANT': 'Compte Courant',
      'EPARGNE': 'Compte Épargne',
      'LIVRET_A': 'Livret A',
      'LIVRET_JEUNE': 'Livret Jeune',
      'PEL': 'Plan Épargne Logement',
      'CEL': 'Compte Épargne Logement'
    };
    return descriptions[type] || type;
  }

  getAccountStatusDescription(statut: string): string {
    const descriptions: { [key: string]: string } = {
      'ACTIF': 'Actif',
      'BLOQUE': 'Bloqué',
      'CLOTURE': 'Clôturé'
    };
    return descriptions[statut] || statut;
  }

  getAllAccounts(): Observable<Account[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Account[]>(`${this.apiUrl}`, { headers });
  }

  bloquerCompte(accountId: number): Observable<Account> {
    const headers = this.getAuthHeaders();
    return this.http.post<Account>(`${this.apiUrl}/${accountId}/bloquer`, {}, { headers });
  }

  debloquerCompte(accountId: number): Observable<Account> {
    const headers = this.getAuthHeaders();
    return this.http.post<Account>(`${this.apiUrl}/${accountId}/debloquer`, {}, { headers });
  }

  cloturerCompte(accountId: number): Observable<Account> {
    const headers = this.getAuthHeaders();
    return this.http.post<Account>(`${this.apiUrl}/${accountId}/cloturer`, {}, { headers });
  }
}