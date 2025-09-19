import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class TransactionFormComponent implements OnInit {
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
    if (this.selectedAccount) {
      this.transactionRequest.accountId = this.selectedAccount.id;
    }
  }

  closeModal(): void {
    this.modalClosed.emit();
    this.resetForm();
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Émettre l'événement avec la transaction
    this.transactionCreated.emit(this.transactionRequest);
  }

  resetForm(): void {
    this.transactionRequest = {
      accountId: this.selectedAccount?.id || 0,
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