import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { EChartsOption } from 'echarts';
import { TransactionStatsService, MonthlySummary } from '../../services/statistique.service';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-statistique',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgxEchartsModule],
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StatistiqueComponent {
  // Options des graphiques ECharts
  monthlyChartOption: EChartsOption = {};
  categoryChartOption: EChartsOption = {};
  balanceChartOption: EChartsOption = {};
  chartOption!: EChartsOption;

  // Données
  monthlySummary: MonthlySummary[] = [];
  globalStats: any = {};
  
  // États
  isLoading = true;
  errorMessage = '';
  
  // Options de taille des graphiques
  chartHeight = '400px';
  chartWidth = '100%';

  // Thème
  theme = 'default';

  constructor(private statsService: TransactionStatsService) {}

  ngOnInit() {
    this.chartOption = {
      title: { text: 'Transactions par mois' },
      tooltip: {},
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [10, 20, 15] }]
    };
    this.loadChartData();
  }

  loadChartData() {
    this.isLoading = true;
    
    this.statsService.getTransactionsByUser().subscribe({
      next: (transactions) => {
        console.log('Transactions chargées:', transactions);
        
        if (transactions.length === 0) {
          this.errorMessage = 'Aucune transaction trouvée';
          this.isLoading = false;
          return;
        }
        
        // Générer les options des graphiques
        this.monthlyChartOption = this.statsService.generateMonthlyChartOptions(transactions);
        this.categoryChartOption = this.statsService.generateCategoryChartOptions(transactions);
        this.balanceChartOption = this.statsService.generateBalanceChartOptions(transactions);
        
        // Données pour le tableau
        this.monthlySummary = this.statsService.getMonthlySummary(transactions);
        this.globalStats = this.statsService.getGlobalStats(transactions);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
        this.isLoading = false;
      }
    });
  }

  // Méthode pour rafraîchir les données
  refreshData() {
    this.loadChartData();
  }

  // Télécharger les données au format CSV
  downloadCSV() {
    const csvContent = this.convertToCSV(this.monthlySummary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions-summary.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(data: MonthlySummary[]): string {
    const headers = ['Mois', 'Revenus (€)', 'Dépenses (€)', 'Solde (€)'];
    const rows = data.map(item => [
      `"${item.month}"`,
      item.revenus.toFixed(2),
      item.depenses.toFixed(2),
      item.solde.toFixed(2)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Méthodes pour calculer les totaux
  getTotalRevenus(): number {
    return this.monthlySummary.reduce((total, item) => total + item.revenus, 0);
  }

  getTotalDepenses(): number {
    return this.monthlySummary.reduce((total, item) => total + item.depenses, 0);
  }

  getTotalSolde(): number {
    return this.getTotalRevenus() - this.getTotalDepenses();
  }

  // Changer le thème
  changeTheme(theme: string) {
    this.theme = theme;
    // Recharger les graphiques avec le nouveau thème
    this.loadChartData();
  }
}