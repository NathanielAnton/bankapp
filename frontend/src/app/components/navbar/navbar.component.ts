import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
   selector: 'app-navbar',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  activeTab: string = 'accounts';
  username: string | null | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Récupérer le nom d'utilisateur depuis le service d'authentification
    this.username = localStorage.getItem('username');
    
    // Déterminer l'onglet actif en fonction de la route
    const currentRoute = this.router.url;
    if (currentRoute.includes('profile')) {
      this.activeTab = 'profile';
    } else if (currentRoute.includes('statistique')){
      this.activeTab = 'statistique';
    }else {
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