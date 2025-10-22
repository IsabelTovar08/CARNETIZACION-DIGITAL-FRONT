// dashboard-home.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CardsService } from '../../../../core/Services/api/card/cards.service';
import { EventService } from '../../../../core/Services/api/event/event.service';
import { CarnetsByUnit, CarnetsByShedule, CarnetsByDivision } from '../../../../core/Models/organization/cards-dashboard.models';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [NgChartsModule, CommonModule, MatButtonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  /// <summary>
  /// Main KPI values
  /// </summary>
  totalCards: number = 0;
  nextEvents: number = 0;
  currentDate: Date = new Date();

  /// <summary>
  /// Raw data holders
  /// </summary>
  unitRawData: CarnetsByUnit[] = [];
  divisionRawData: CarnetsByDivision[] = [];

  /// <summary>
  /// Chart data objects
  /// </summary>
  unitOrgChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  shiftChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  divisionChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  eventsChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  /// <summary>
  /// Muted palette (less saturated, corporate feeling)
  /// </summary>
  private readonly chartColors = {
    unit:   '#5E6A83',  // slate-blue muted
    shift:  '#6E8B87',  // teal-grey muted
    division:'#7A78A6', // muted violet
    events: '#6F86A6'   // steel blue
  };

  /// <summary>
  /// Small vertical bar charts options (muted grids and ticks)
  /// </summary>
  smallBarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.92)',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        displayColors: false
      }
    },
    scales: {
      x: {
        // border is configured at scale-level (not inside grid) to avoid TS typing issues
        border: { display: false },
        grid: { color: 'rgba(100,116,139,0.08)', display: true },
        ticks: { font: { size: 11, weight: 500 }, color: '#475569' }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(100,116,139,0.08)', display: true },
        ticks: { font: { size: 11, weight: 500 }, color: '#475569', padding: 6 }
      }
    },
    animation: { duration: 800, easing: 'easeInOutQuad' }
  };

  /// <summary>
  /// Horizontal bar charts options (muted look)
  /// </summary>
  horizontalBarChartOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(30,41,59,0.92)',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        displayColors: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(100,116,139,0.08)', display: true },
        ticks: { font: { size: 11, weight: 500 }, color: '#475569' }
      },
      y: {
        border: { display: false },
        grid: { color: 'rgba(100,116,139,0.08)', display: false },
        ticks: { font: { size: 12, weight: 600 }, color: '#334155', padding: 8 }
      }
    },
    animation: { duration: 900, easing: 'easeInOutQuad' }
  };

  /// <summary>
  /// Sample notifications list for the side card
  /// </summary>
  notifications = [
    { name: 'Ana García',    message: 'Solicitud de modificación de datos', avatar: 'https://i.pravatar.cc/48?img=47', time: 'Hace 5 minutos' },
    { name: 'Carlos López',  message: 'Solicitud de modificación de datos', avatar: 'https://i.pravatar.cc/48?img=12', time: 'Hace 15 minutos' },
    { name: 'Sofía Martínez',message: 'Solicitud de modificación de datos', avatar: 'https://i.pravatar.cc/48?img=25', time: 'Hace 30 minutos' },
  ];

  constructor(
    private cardsService: CardsService,
    private eventService: EventService
  ) {}

  /// <summary>
  /// Lifecycle init
  /// </summary>
  ngOnInit(): void {
    this.getTotalCards();
    this.getTotalEvents();
    this.loadUnitData();
    this.loadShiftData();
    this.loadEventsData();
  }

  /// <summary>
  /// Fetch total cards
  /// </summary>
  getTotalCards(): void {
    this.cardsService.GetTotalNumberOfIDCardsAsync().subscribe({
      next: (result) => this.totalCards = result.data ?? 0,
      error: (err) => console.error('Error fetching total cards:', err)
    });
  }

  /// <summary>
  /// Fetch upcoming events count
  /// </summary>
  getTotalEvents(): void {
    // this.eventService.GetAvailableEventsCount().subscribe({
    //   next: (result) => this.nextEvents = result.data ?? 0,
    //   error: (err) => console.error('Error fetching total events:', err)
    // });
  }

  /// <summary>
  /// Load cards by organizational unit (muted single-color bars)
  /// </summary>
  loadUnitData(): void {
    this.cardsService.getByUnit().subscribe({
      next: (res) => {
        this.totalCards = res.data.total;
        this.unitRawData = res.data.data;

        const color = this.chartColors.unit;
        const bg = this.buildColorArray(this.unitRawData.length, color, 0.65);

        this.unitOrgChartData = {
          labels: this.unitRawData.map(x => x.unidadOrganizativa),
          datasets: [
            {
              label: 'Carnets',
              data: this.unitRawData.map(x => x.totalCarnets),
              backgroundColor: bg,
              hoverBackgroundColor: this.withAlpha(color, 0.8),
              borderColor: this.withAlpha(color, 1),
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false
            }
          ]
        };
      },
      error: (err) => console.error('Error loading unit data:', err)
    });
  }

  /// <summary>
  /// Load cards by work shift (muted teal-grey)
  /// </summary>
  loadShiftData(): void {
    this.cardsService.getByShedule().subscribe({
      next: (res) => {
        const color = this.chartColors.shift;
        const bg = this.buildColorArray(res.data.length, color, 0.6);

        this.shiftChartData = {
          labels: res.data.map((x: CarnetsByShedule) => x.jornada),
          datasets: [
            {
              label: 'Carnets',
              data: res.data.map((x: CarnetsByShedule) => x.totalCarnets),
              backgroundColor: bg,
              hoverBackgroundColor: this.withAlpha(color, 0.8),
              borderColor: this.withAlpha(color, 1),
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false
            }
          ]
        };
      },
      error: (err) => console.error('Error loading shift data:', err)
    });
  }

  /// <summary>
  /// Load events bar (muted steel-blue)
  /// </summary>
  loadEventsData(): void {
    const names = ['Capacitación', 'Reunión', 'Auditoría', 'Ceremonia', 'Workshop'];
    const values = [150, 50, 100, 250, 30];

    const color = this.chartColors.events;
    const bg = this.buildColorArray(values.length, color, 0.6);

    this.eventsChartData = {
      labels: names,
      datasets: [
        {
          label: 'Participantes',
          data: values,
          backgroundColor: bg,
          hoverBackgroundColor: this.withAlpha(color, 0.8),
          borderColor: this.withAlpha(color, 1),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }

  /// <summary>
  /// On bar click (units) -> load divisions (muted violet)
  /// </summary>
  onUnitClick(event: any): void {
    if (event?.active?.length > 0) {
      const index = event.active[0].index;
      const unitId = this.unitRawData[index].unidadOrganizativaId;

      this.cardsService.getInternalDivisionByUnit(unitId).subscribe({
        next: (res) => {
          this.divisionRawData = res.data;

          const color = this.chartColors.division;
          const bg = this.buildColorArray(this.divisionRawData.length, color, 0.6);

          this.divisionChartData = {
            labels: this.divisionRawData.map(x => x.divisionInterna),
            datasets: [
              {
                label: 'Carnets',
                data: this.divisionRawData.map(x => x.totalCarnets),
                backgroundColor: bg,
                hoverBackgroundColor: this.withAlpha(color, 0.8),
                borderColor: this.withAlpha(color, 1),
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
              }
            ]
          };
        },
        error: (err) => console.error('Error loading divisions:', err)
      });
    }
  }

  /// <summary>
  /// Build an RGBA color from HEX with alpha
  /// </summary>
  private withAlpha(hexColor: string, alpha: number): string {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /// <summary>
  /// Create an array of the same RGBA color for bar datasets
  /// </summary>
  private buildColorArray(count: number, hexColor: string, alpha: number): string[] {
    const rgba = this.withAlpha(hexColor, alpha);
    return Array.from({ length: Math.max(count, 0) }, () => rgba);
  }
}
