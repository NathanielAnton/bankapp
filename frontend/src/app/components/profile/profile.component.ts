// profile.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService, ClientProfile } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  profile: ClientProfile = {
    id: 0,
    userId: 0,
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    dateNaissance: ''
  };

  isEditing = false;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.isLoading = false;
        // Si le profil n'existe pas encore, on initialise un objet vide
        if (error.status === 404) {
          this.profile = {
            id: 0,
            userId: 0,
            nom: '',
            prenom: '',
            adresse: '',
            telephone: '',
            dateNaissance: ''
          };
        }
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadProfile(); // Recharger les données originales
    }
  }

  saveProfile(): void {
    this.isLoading = true;
    
    const saveOperation = this.profile.id 
      ? this.profileService.updateProfile(this.profile)
      : this.profileService.createProfile(this.profile);

    saveOperation.subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.isEditing = false;
        this.isLoading = false;
        this.showMessage('Profil mis à jour avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.isLoading = false;
        this.showMessage('Erreur lors de la sauvegarde du profil', 'error');
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile();
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  getAge(): number | null {
    if (!this.profile.dateNaissance) return null;
    
    const birthDate = new Date(this.profile.dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  isAdult(): boolean {
    const age = this.getAge();
    return age !== null && age >= 18;
  }
}