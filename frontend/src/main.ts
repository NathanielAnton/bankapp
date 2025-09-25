import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideEchartsCore } from 'ngx-echarts';

// ⚡ Import ECharts core
import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// ⚡ Enregistrement des modules ECharts
echarts.use([
  LineChart,
  BarChart,      
  PieChart,  
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

// Fusionner la configuration existante avec provideEchartsCore
const mergedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideEchartsCore({ echarts }) 
  ]
};

bootstrapApplication(AppComponent, mergedConfig).catch(err => console.error(err));