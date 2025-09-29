import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EChartsOption } from 'echarts';

export interface MonthlySummary {
  month: string;
  revenus: number;
  depenses: number;
  solde: number;
}

export interface CategorySummary {
  categorie: string;
  montant: number;
  type: 'revenu' | 'depense';
}

@Injectable({
  providedIn: 'root'
})
export class TransactionStatsService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Récupérer toutes les transactions de l'utilisateur connecté
  getTransactionsByUser(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    // Adaptez cet endpoint selon votre API
    return this.http.get<any[]>(`${this.apiUrl}/user/current`, { headers });
  }

  // Générer les options pour le graphique mensuel (barres)
  generateMonthlyChartOptions(transactions: any[]): EChartsOption {
    const monthlyData = this.groupByMonth(transactions);
    const labels = monthlyData.map(item => item.month);
    const revenusData = monthlyData.map(item => item.revenus);
    const depensesData = monthlyData.map(item => item.depenses);

    return {
      title: {
        text: 'Revenus et Dépenses par Mois',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0];
          const month = data.axisValue;

          const entry = monthlyData.find(item => item.month === month);
            if (!entry) return '';

          const solde = entry.revenus - entry.depenses;
          
          return `
            <strong>${month}</strong><br/>
            Revenus: <span style="color: #28a745">${entry.revenus.toFixed(2)}€</span><br/>
            Dépenses: <span style="color: #dc3545">${entry.depenses.toFixed(2)}€</span><br/>
            Solde: <span style="color: ${solde >= 0 ? '#28a745' : '#dc3545'}">${solde.toFixed(2)}€</span>
          `;
        }
      },
      legend: {
        data: ['Revenus', 'Dépenses'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Montant (€)'
      },
      series: [
        {
          name: 'Revenus',
          type: 'bar',
          data: revenusData,
          itemStyle: {
            color: '#28a745'
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: 'Dépenses',
          type: 'bar',
          data: depensesData,
          itemStyle: {
            color: '#dc3545'
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  }

  // Générer les options pour le camembert des catégories
  generateCategoryChartOptions(transactions: any[]): EChartsOption {
    const categoryData = this.groupByCategory(transactions);
    
    return {
      title: {
        text: 'Répartition par Catégorie',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}€ ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        type: 'scroll'
      },
      series: [
        {
          name: 'Catégories',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: categoryData.map(item => ({
            value: item.montant,
            name: item.categorie,
            itemStyle: {
              color: this.getCategoryColor(item.categorie)
            }
          }))
        }
      ]
    };
  }

  // Graphique de ligne pour l'évolution du solde
  generateBalanceChartOptions(transactions: any[]): EChartsOption {
    const monthlyData = this.groupByMonth(transactions);
    const labels = monthlyData.map(item => item.month);
    const soldeData = monthlyData.map(item => 
      item.revenus - item.depenses
    );

    return {
      title: {
        text: 'Évolution du Solde',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Solde (€)'
      },
      series: [
        {
          data: soldeData,
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#007bff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(0, 123, 255, 0.3)'
              }, {
                offset: 1, color: 'rgba(0, 123, 255, 0.1)'
              }]
            }
          }
        }
      ]
    };
  }

    // Grouper les transactions par mois et trier
    private groupByMonth(transactions: any[]): { month: string, revenus: number, depenses: number }[] {
      const monthlyData: { [key: string]: { revenus: number, depenses: number, date: Date } } = {};

      transactions.forEach(transaction => {
        if (transaction.type === 'VIREMENT_INTERNE' || transaction.type === 'VIREMENT_EXTERNE') {
          return;
        }

        const date = new Date(transaction.dateTransaction);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const monthLabel = this.getMonthLabel(date);

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenus: 0, depenses: 0, date };
        }

        if (this.isRevenue(transaction.type)) {
          monthlyData[monthKey].revenus += transaction.montant;
        } else {
          monthlyData[monthKey].depenses += Math.abs(transaction.montant);
        }
      });

      // ✅ Transformer en tableau trié
      return Object.keys(monthlyData)
        .sort() // tri YYYY-MM
        .map(key => ({
          month: this.getMonthLabel(monthlyData[key].date),
          revenus: monthlyData[key].revenus,
          depenses: monthlyData[key].depenses
        }));
    }


    // Grouper les transactions par catégorie
    private groupByCategory(transactions: any[]): CategorySummary[] {
        const categoryMap = new Map<string, number>();

        transactions.forEach(transaction => {
            if (transaction.type === 'VIREMENT_INTERNE' || transaction.type === 'VIREMENT_EXTERNE') {
                return;
            }
            const categorie = transaction.categorieLibelle || 'Non catégorisé';
            const montant = this.isRevenue(transaction.type) ? transaction.montant : -transaction.montant;

            if (categoryMap.has(categorie)) {
            categoryMap.set(categorie, categoryMap.get(categorie)! + montant);
            } else {
            categoryMap.set(categorie, montant);
            }
        });

        return Array.from(categoryMap.entries()).map(([categorie, montant]) => ({
            categorie,
            montant: Math.abs(montant),
            type: montant >= 0 ? 'revenu' as const : 'depense' as const 
        })).sort((a, b) => b.montant - a.montant);
    }

  // Vérifier si c'est un revenu
  private isRevenue(type: string): boolean {
    return type === 'CREDIT';
  }

  // Obtenir le libellé du mois
  private getMonthLabel(date: Date): string {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  // Couleurs pour les catégories
  private getCategoryColor(category: string): string {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FFCD56',
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
    ];
    
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Obtenir le résumé mensuel pour un tableau
  getMonthlySummary(transactions: any[]): MonthlySummary[] {
    const monthlyData = this.groupByMonth(transactions);

    return monthlyData
      .map(data => ({
        month: data.month,
        revenus: data.revenus,
        depenses: data.depenses,
        solde: data.revenus - data.depenses
      }))
      .sort((a, b) => {
        const [moisA, anneeA] = a.month.split(' ');
        const [moisB, anneeB] = b.month.split(' ');
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                        'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const dateA = new Date(parseInt(anneeA), months.indexOf(moisA));
        const dateB = new Date(parseInt(anneeB), months.indexOf(moisB));

        return dateB.getTime() - dateA.getTime();
      });
  }
}