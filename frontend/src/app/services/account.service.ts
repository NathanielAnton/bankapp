import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) {}

  getMyAccounts(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    
    // Vérifier que le token existe
    if (!token) {
      console.error('Aucun token JWT trouvé dans le localStorage');
      console.log('Clés disponibles:', Object.keys(localStorage));
      throw new Error('Authentication required');
    }

    console.log('Token utilisé:', token); // Pour debug

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<any[]>(`${this.apiUrl}/me`, { headers });
  }
}