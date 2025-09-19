import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← Ajouter cette importation
import { AccountRequest, AccountService } from '../../services/account.service';

interface Account {
  id: number;
  clientId: number;
  type: 'COURANT' | 'EPARGNE' | 'LIVRET_A' | 'LIVRET_JEUNE' | 'PEL' | 'CEL';
  solde: number;
  statut: 'ACTIF' | 'BLOQUE' | 'CLOTURE';
  dateOuverture: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error: string | null = null;
  username: string | null | undefined;

    // Propriétés pour le modal
  showCreateModal = false;
  newAccount: AccountRequest = {
    clientId: 0,
    type: 'COURANT',
    solde: 0,
    statut: 'ACTIF'
  };
  creatingAccount = false;
  createError: string | null = null;

  // Options pour les selects
  accountTypes = [
    { value: 'COURANT', label: 'Compte Courant' },
    { value: 'EPARGNE', label: 'Compte Épargne' },
    { value: 'LIVRET_A', label: 'Livret A' },
    { value: 'LIVRET_JEUNE', label: 'Livret Jeune' },
    { value: 'PEL', label: 'Plan Épargne Logement' },
    { value: 'CEL', label: 'Compte Épargne Logement' }
  ];

  statusOptions = [
    { value: 'ACTIF', label: 'Actif' },
    { value: 'BLOQUE', label: 'Bloqué' },
    { value: 'CLOTURE', label: 'Clôturé' }
  ];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.loading = true;
    this.accountService.getMyAccounts().subscribe({
      next: (data: Account[]) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des comptes", err);
        this.error = "Impossible de charger vos comptes";
        this.loading = false;
      }
    });
  }

  /**
   * Calcule le solde total de tous les comptes
   */
  getTotalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.solde, 0);
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.createError = null;
    
    const clientId = localStorage.getItem('clientID');
    if (clientId) {
      this.newAccount.clientId = parseInt(clientId, 10);
    } else {
      console.error('Client ID non trouvé dans le localStorage');
      this.createError = 'Erreur: ID client non disponible';
    }
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newAccount = {
      clientId: 0,
      type: 'COURANT',
      solde: 0,
      statut: 'ACTIF'
    };
    this.createError = null;
  }

  createAccount(): void {
    if (!this.newAccount.type || this.newAccount.solde < 0 || !this.newAccount.clientId) {
      this.createError = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.creatingAccount = true;
    this.createError = null;

    this.accountService.createAccount(this.newAccount).subscribe({
      next: (response) => {
        this.creatingAccount = false;
        this.closeCreateModal();
        this.loadAccounts();
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        this.createError = err.error?.message || 'Erreur lors de la création du compte';
        this.creatingAccount = false;
      }
    });
  }

  /**
   * Retourne l'icône correspondant au type de compte
   */
 getAccountIcon(type: string): string {
  switch (type) {
    case 'COURANT':
      return '💳';
    case 'EPARGNE':
      return '🏦';
    case 'LIVRET_A':
      return '📘';
    case 'LIVRET_JEUNE':
      return '👦';
    case 'PEL':
      return '🏠';
    case 'CEL':
      return '🏡';
    default:
      return '💰';
  }
}

  /**
   * Retourne le label lisible du type de compte
   */
  getAccountTypeLabel(type: string): string {
  switch (type) {
    case 'COURANT':
      return 'Compte Courant';
    case 'EPARGNE':
      return 'Compte Épargne';
    case 'LIVRET_A':
      return 'Livret A';
    case 'LIVRET_JEUNE':
      return 'Livret Jeune';
    case 'PEL':
      return 'Plan Épargne Logement';
    case 'CEL':
      return 'Compte Épargne Logement';
    default:
      return 'Compte';
  }
}

  /**
   * Formate une date au format français
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Retourne l'heure actuelle formatée
   */
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Gère les actions sur les comptes (virement, historique, etc.)
   */
  handleAccountAction(account: Account, action: 'transfer' | 'history'): void {
    switch (action) {
      case 'transfer':
        this.handleTransfer(account);
        break;
      case 'history':
        this.showHistory(account);
        break;
    }
  }

  /**
   * Gère les virements/retraits
   */
  private handleTransfer(account: Account): void {
    console.log(`Action de transfert sur le compte ${account.id}`);
    // TODO: Implémenter la logique de virement/retrait
    // Rediriger vers la page de virement ou ouvrir un modal
  }

  /**
   * Affiche l'historique du compte
   */
  private showHistory(account: Account): void {
    console.log(`Affichage de l'historique du compte ${account.id}`);
    // TODO: Implémenter la logique d'affichage de l'historique
    // Rediriger vers la page d'historique
  }

  /**
   * Rafraîchit les données des comptes
   */
  refreshAccounts(): void {
    this.loadAccounts();
  }

  /**
   * Retourne la classe CSS pour le statut du compte
   */
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  /**
   * Vérifie si le compte est actif
   */
  isAccountActive(account: Account): boolean {
    return account.statut === 'ACTIF';
  }

  /**
   * Retourne le nombre de comptes actifs
   */
  getActiveAccountsCount(): number {
    return this.accounts.filter(account => this.isAccountActive(account)).length;
  }

  /**
   * Retourne le compte avec le solde le plus élevé
   */
  getHighestBalanceAccount(): Account | null {
    if (this.accounts.length === 0) return null;
    return this.accounts.reduce((prev, current) => 
      (prev.solde > current.solde) ? prev : current
    );
  }

  /**
   * Formate un montant en euros
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}