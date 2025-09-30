import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionRequest {
  accountId: number;
  destinataireAccountId?: number;
  type: 'DEBIT' | 'CREDIT' | 'VIREMENT_INTERNE' | 'VIREMENT_EXTERNE';
  montant: number;
  description: string;
  categorieId?: number;
  dateTransaction?: string;
}

export interface TransactionResponse {
  id: number;
  accountId: number;
  destinataireAccountId?: number;
  type: string;
  typeLibelle: string;
  montant: number;
  dateTransaction: string;
  description: string;
  categorieLibelle?: string;
  categorieId?: number;
}

export interface Category {
  id: number;
  libelle: string;
  description?: string;
}

export interface UpdateTransactionCategoryRequest {
  categorieId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

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

  // Créer une nouvelle transaction
  createTransaction(transactionRequest: TransactionRequest): Observable<TransactionResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<TransactionResponse>(this.apiUrl, transactionRequest, { headers });
  }

  // Récupérer les transactions d'un compte
  getTransactionsByAccount(accountId: number): Observable<TransactionResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/account/${accountId}`, { headers });
  }

  // Récupérer les transactions d'un client
  getTransactionsByClient(clientId: number): Observable<TransactionResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/client/${clientId}`, { headers });
  }

  // Récupérer une transaction par son ID
  getTransactionById(id: number): Observable<TransactionResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<TransactionResponse>(`${this.apiUrl}/${id}`, { headers });
  }

  // Mettre à jour la catégorie d'une transaction
  updateTransactionCategory(transactionId: number, categorieId: number): Observable<TransactionResponse> {
    const headers = this.getAuthHeaders();
    const request: UpdateTransactionCategoryRequest = { categorieId };
    return this.http.patch<TransactionResponse>(`${this.apiUrl}/${transactionId}/categorie`, request, { headers });
  }

  // Récupérer les transactions par catégorie
  getTransactionsByCategory(categorieId: number): Observable<TransactionResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/categorie/${categorieId}`, { headers });
  }

  // Récupérer toutes les catégories 
  getAllCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { headers });
  }

  // Méthodes utilitaires pour les descriptions
  getTransactionTypeDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'DEBIT': 'Débit',
      'CREDIT': 'Crédit',
      'VIREMENT_INTERNE': 'Virement Interne',
      'VIREMENT_EXTERNE': 'Virement Externe'
    };
    return descriptions[type] || type;
  }

  // Formater le montant avec le symbole approprié
  formatAmount(amount: number, type: string): string {
    const symbol = type === 'DEBIT' || type === 'VIREMENT_INTERNE' || type === 'VIREMENT_EXTERNE' ? '-' : '+';
    return `${symbol}${amount.toFixed(2)}€`;
  }

  // Vérifier si c'est une transaction de débit
  isDebit(type: string): boolean {
    return type === 'DEBIT' || type === 'VIREMENT_INTERNE' || type === 'VIREMENT_EXTERNE';
  }

  // Vérifier si c'est une transaction de crédit
  isCredit(type: string): boolean {
    return type === 'CREDIT';
  }

  // Vérifier si c'est un virement
  isVirement(type: string): boolean {
    return type === 'VIREMENT_INTERNE' || type === 'VIREMENT_EXTERNE';
  }
}