import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientProfile {
  id: number;
  userId: number;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  dateNaissance: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/client-profiles';

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
  
  getProfile(): Observable<ClientProfile> {
    const headers = this.getAuthHeaders();
    return this.http.get<ClientProfile>(`${this.apiUrl}/me`, { headers });
  }

  updateProfile(profileData: Partial<ClientProfile>): Observable<ClientProfile> {
    const headers = this.getAuthHeaders();
    return this.http.put<ClientProfile>(`${this.apiUrl}/me`, profileData, { headers });
  }

  createProfile(profileData: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.post<ClientProfile>(this.apiUrl, profileData);
  }
}