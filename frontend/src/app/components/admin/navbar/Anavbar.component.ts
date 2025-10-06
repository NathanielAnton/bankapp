import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
   selector: 'app-navbar',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './Anavbar.component.html',
  styleUrls: ['./Anavbar.component.css']
})
export class ANavbarComponent implements OnInit {
  activeTab: string = 'accounts';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Déterminer l'onglet actif en fonction de la route
    const currentRoute = this.router.url;
    if (currentRoute.includes('registre')) {
      this.activeTab = 'registre';
    } else {
      this.activeTab = 'accounts';
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  disconnect(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}