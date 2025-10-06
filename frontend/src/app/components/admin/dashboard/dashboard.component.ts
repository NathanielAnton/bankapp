import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { ANavbarComponent } from '../navbar/Anavbar.component';

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
}
