import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { ANavbarComponent } from '../navbar/Anavbar.component';
import { Observable } from 'rxjs';

interface Account {
  id: number;
  clientId: number;
  type: string;
  solde: number;
  statut: string;
  dateOuverture: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ANavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ADashboardComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error: string | null = null;
  actionInProgress: { [key: number]: string } = {}; 

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAllAccounts();
  }

  private loadAllAccounts(): void {
    this.loading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (data: Account[]) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des comptes admin", err);
        this.error = "Impossible de charger les comptes";
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  // Méthodes pour gérer les statuts
  bloquerCompte(accountId: number): void {
    this.executeAction(accountId, 'bloquer', () => 
      this.accountService.bloquerCompte(accountId)
    );
  }

  debloquerCompte(accountId: number): void {
    this.executeAction(accountId, 'debloquer', () => 
      this.accountService.debloquerCompte(accountId)
    );
  }

  cloturerCompte(accountId: number): void {
    if (confirm('Êtes-vous sûr de vouloir clôturer ce compte ? Cette action est irréversible.')) {
      this.executeAction(accountId, 'cloturer', () => 
        this.accountService.cloturerCompte(accountId)
      );
    }
  }

  // Méthode générique pour exécuter les actions
  private executeAction(accountId: number, action: string, serviceCall: () => Observable<Account>): void {
    this.actionInProgress[accountId] = action;
    
    serviceCall().subscribe({
      next: (updatedAccount) => {
        const index = this.accounts.findIndex(acc => acc.id === accountId);
        if (index !== -1) {
          this.accounts[index] = updatedAccount;
        }
        this.actionInProgress[accountId] = '';
        
        console.log(`Compte ${accountId} ${action} avec succès`);
      },
      error: (err) => {
        console.error(`Erreur lors du ${action} du compte ${accountId}`, err);
        this.error = `Erreur lors du ${action} du compte: ${err.error?.message || err.message}`;
        this.actionInProgress[accountId] = '';
        
        this.loadAllAccounts();
      }
    });
  }

  // Vérifier si une action est en cours pour un compte
  isActionInProgress(accountId: number): boolean {
    return !!this.actionInProgress[accountId];
  }

  // Obtenir le texte du bouton en fonction du statut
  getActionButtons(account: Account): any {
    switch (account.statut) {
      case 'ACTIF':
        return {
          primary: { 
            text: '🔒 Bloquer', 
            action: () => this.bloquerCompte(account.id),
            class: 'btn-warning'
          },
          secondary: { 
            text: '🚫 Clôturer', 
            action: () => this.cloturerCompte(account.id),
            class: 'btn-danger'
          }
        };
      case 'BLOQUE':
        return {
          primary: { 
            text: '🔓 Débloquer', 
            action: () => this.debloquerCompte(account.id),
            class: 'btn-success'
          },
          secondary: { 
            text: '🚫 Clôturer', 
            action: () => this.cloturerCompte(account.id),
            class: 'btn-danger'
          }
        };
      case 'CLOTURE':
        return {
          primary: null,
          secondary: null,
          message: 'Compte clôturé'
        };
      default:
        return {
          primary: null,
          secondary: null
        };
    }
  }
}