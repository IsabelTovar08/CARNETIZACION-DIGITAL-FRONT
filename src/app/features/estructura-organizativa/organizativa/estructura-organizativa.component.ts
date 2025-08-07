import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

interface Notificacion {
  usuario: string;
  mensaje: string;
  avatar: string;
}

@Component({
  selector: 'app-estructura-organizativa',
  templateUrl: './estructura-organizativa.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./estructura-organizativa.component.css']
})
export class EstructuraOrganizativaComponent {
  // Datos de notificaciones
  notificaciones: Notificacion[] = [
    {
      usuario: 'Ana García',
      mensaje: 'Solicitud de modificación de datos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
    },
    {
      usuario: 'Carlos López',
      mensaje: 'Registro de nuevo evento',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
    },
    {
      usuario: 'Sofía Martínez',
      mensaje: 'Carnet emitido correctamente',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    }
  ];

  // Gráfico de barras (por unidad organizativa)
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Administración', 'Soporte', 'Seguridad', 'Diseño'],
    datasets: [
      {
        label: 'Carnets Emitidos',
        data: [300, 450, 200, 300],
        backgroundColor: '#6366f1'
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  // Gráfico de líneas (por jornada)
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mañana', 'Tarde', 'Noche'],
    datasets: [
      {
        data: [400, 350, 500],
        label: 'Carnets por Jornada',
        fill: true,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)'
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
}
