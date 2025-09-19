import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService, TransactionResponse } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TransactionHistoryComponent implements OnInit, OnChanges { 
  @Input() accountId: number | undefined = undefined;
  @Input() clientId: number | undefined = undefined;  
  @Input() showModal = false;
  
  transactions: TransactionResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    public transactionService: TransactionService,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Charger les transactions si le modal est déjà ouvert à l'initialisation
    if (this.showModal && (this.accountId || this.clientId)) {
      this.loadTransactions();
    }
  }

  // Ajoutez cette méthode pour détecter les changements d'input
  ngOnChanges(changes: SimpleChanges): void {
    // Si showModal passe à true et qu'on a un accountId ou clientId
    if (changes['showModal'] && this.showModal && (this.accountId || this.clientId)) {
      this.loadTransactions();
    }
    
    // Si accountId change et que le modal est ouvert
    if (changes['accountId'] && this.showModal && this.accountId) {
      this.loadTransactions();
    }
    
    // Si clientId change et que le modal est ouvert
    if (changes['clientId'] && this.showModal && this.clientId) {
      this.loadTransactions();
    }
  }

  @Output() modalClosed = new EventEmitter<void>();

  closeModal(): void {
    this.modalClosed.emit();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.transactions = [];

    if (this.accountId) {
      this.loadAccountTransactions();
    } else if (this.clientId) {
      this.loadClientTransactions();
    } else {
      this.isLoading = false;
    }
  }

  private loadAccountTransactions(): void {
    if (!this.accountId) return;

    console.log('Chargement des transactions pour le compte:', this.accountId);
    
    this.transactionService.getTransactionsByAccount(this.accountId).subscribe({
      next: (transactions) => {
        console.log('Transactions reçues:', transactions);
        this.transactions = this.sortTransactions(transactions);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des transactions';
        this.isLoading = false;
      }
    });
  }

  private loadClientTransactions(): void {
    if (!this.clientId) return;

    console.log('Chargement des transactions pour le client:', this.clientId);
    
    this.transactionService.getTransactionsByClient(this.clientId).subscribe({
      next: (transactions) => {
        console.log('Transactions reçues:', transactions);
        this.transactions = this.sortTransactions(transactions);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des transactions';
        this.isLoading = false;
      }
    });
  }

  private sortTransactions(transactions: TransactionResponse[]): TransactionResponse[] {
    return transactions.sort((a, b) => 
      new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTransactionClass(type: string): string {
    if (this.isDebit(type)) {
      return 'text-danger';
    } else if (this.isCredit(type)) {
      return 'text-success';
    }
    return '';
  }

  // Ajoutez ces méthodes pour éviter d'utiliser le service dans le template
  isDebit(type: string): boolean {
    return type === 'DEBIT' || type === 'VIREMENT_INTERNE' || type === 'VIREMENT_EXTERNE';
  }

  isCredit(type: string): boolean {
    return type === 'CREDIT';
  }

  formatAmount(amount: number, type: string): string {
    const symbol = this.isDebit(type) ? '-' : '+';
    return `${symbol}${amount.toFixed(2)}€`;
  }
}