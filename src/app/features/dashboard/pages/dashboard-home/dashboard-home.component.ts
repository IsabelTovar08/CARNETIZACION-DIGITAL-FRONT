import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-home',
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
unitOrgChartLabels = ['ADSO', 'Multimedia', 'Soldadura'];
  unitOrgChartData: ChartData<'bar'> = {
    labels: this.unitOrgChartLabels,
    datasets: [
      {
        label: 'Carnets',
        data: [400, 500, 350],
        backgroundColor: '#0d6efd',
        borderRadius: 5
      }
    ]
  };

  shiftChartLabels = ['Mañana', 'Tarde', 'Noche'];
  shiftChartData: ChartData<'bar'> = {
    labels: this.shiftChartLabels,
    datasets: [
      {
        label: 'Carnets',
        data: [400, 400, 400],
        backgroundColor: '#198754',
        borderRadius: 5
      }
    ]
  };

  eventsChartLabels = ['Evento 1', 'Evento 2', 'Evento 3', 'Evento 4', 'Evento 5'];
  eventsChartData: ChartData<'bar'> = {
    labels: this.eventsChartLabels,
    datasets: [
      {
        label: 'Eventos',
        data: [150, 50, 100, 250, 30],
        backgroundColor: '#0dcaf0',
        borderRadius: 5
      }
    ]
  };

  notifications = [
    { name: 'Ana García', message: 'Solicitud de modificación de datos', avatar: 'https://i.pravatar.cc/48?img=47' },
    { name: 'Carlos López', message: 'Solicitud de modificación de datos', avatar: 'https://i.pravatar.cc/48?img=12' },
    { name: 'Sofía Martínez', message: 'Solicitud de modificación de datos', avatar: 'https://i.pravatar.cc/48?img=25' },
  ];

  smallBarChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { display: false } },
      y: { beginAtZero: true, grid: { display: false } }
    }
  };

  horizontalBarChartOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true },
      y: { grid: { display: false } }
    }
  };
}
