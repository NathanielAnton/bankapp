import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionRequest } from '../../../services/transaction.service';
import { Account } from '../../../services/account.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule] 
})
export class TransactionFormComponent implements OnInit, OnChanges { 
  @Input() accounts: Account[] = [];
  @Input() selectedAccount: Account | null = null;
  @Input() showModal = false;
  
  @Output() modalClosed = new EventEmitter<void>();
  @Output() transactionCreated = new EventEmitter<TransactionRequest>();
  
  transactionRequest: TransactionRequest = {
    accountId: 0,
    type: 'DEBIT',
    montant: 0,
    description: ''
  };
  
  errorMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.updateAccountId();
  }

  // Ajoutez cette méthode pour détecter les changements d'input
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAccount'] && this.selectedAccount) {
      this.updateAccountId();
    }
    
    if (changes['showModal'] && this.showModal) {
      this.resetForm();
    }
  }

  // Méthode pour mettre à jour l'accountId
  private updateAccountId(): void {
    if (this.selectedAccount) {
      this.transactionRequest.accountId = this.selectedAccount.id;
    } else if (this.accounts.length > 0) {
      // Fallback: prendre le premier compte si aucun sélectionné
      this.transactionRequest.accountId = this.accounts[0].id;
    }
  }

  closeModal(): void {
    this.modalClosed.emit();
    this.resetForm();
  }

  onSubmit(): void {
    // Validation supplémentaire
    if (this.transactionRequest.accountId === 0) {
      this.errorMessage = 'Veuillez sélectionner un compte';
      return;
    }
    
    if (this.transactionRequest.montant <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à 0';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.transactionCreated.emit({...this.transactionRequest});
  }

  resetForm(): void {
    this.transactionRequest = {
      accountId: this.selectedAccount?.id || (this.accounts.length > 0 ? this.accounts[0].id : 0),
      type: 'DEBIT',
      montant: 0,
      description: ''
    };
    this.errorMessage = '';
    this.isLoading = false;
  }

  getAvailableDestinataireAccounts(): Account[] {
    return this.accounts.filter(account => account.id !== this.transactionRequest.accountId);
  }

  showDestinataireField(): boolean {
    return this.transactionRequest.type === 'VIREMENT_INTERNE' || 
           this.transactionRequest.type === 'VIREMENT_EXTERNE';
  }
}