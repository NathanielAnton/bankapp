import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Bienvenue sur ton Dashboard</h1>
    <p>Connecté en tant que <strong>{{ username }}</strong></p>
  `
})
export class DashboardComponent {
  username: string | null = null;

  constructor(private tokenService: TokenService) {
    this.username = localStorage.getItem('username');
  }
}
