// dashboard-home.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CardsService } from '../../../../core/Services/api/card/cards.service';
import { EventService } from '../../../../core/Services/api/event/event.service';
import { CarnetsByUnit, CarnetsByShedule, CarnetsByDivision, EventsByType, EventTopAttendance } from '../../../../core/Models/organization/cards-dashboard.models';
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
  totalCardsCondigurations: number = 0;
  nextEvents: number = 0;
  currentDate: Date = new Date();

  /// <summary>
  /// Raw data holders
  /// </summary>
  unitRawData: CarnetsByUnit[] = [];
  divisionRawData: CarnetsByDivision[] = [];
  eventTypesRawData: EventsByType[] = [];
  eventTopAttendanceRawData: EventTopAttendance[] = [];

  /// <summary>
  /// Control flags
  /// </summary>
  selectedEventTypeId: number | null = null;

  /// <summary>
  /// Chart data objects
  /// </summary>
  unitOrgChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  shiftChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  divisionChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  eventsChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  eventTypesChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  eventTopAttendanceChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  /// <summary>
  /// Muted palette (less saturated, corporate feeling)
  /// </summary>
  private readonly chartColors = {
    unit:   '#5E6A83',  // slate-blue muted
    shift:  '#6E8B87',  // teal-grey muted
    division:'#7A78A6', // muted violet
    events: '#6F86A6',   // steel blue
    eventTypes: '#8B5CF6', // purple
    eventTopAttendance: '#06B6D4' // cyan
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
  /// Fixed height bar charts options for top attendance (to prevent infinite stretching)
  /// </summary>
  fixedHeightBarChartOptions: ChartOptions = {
    responsive: false,
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
  /// Non-responsive horizontal bar charts options (to prevent stretching)
  /// </summary>
  nonResponsiveHorizontalBarChartOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: false,
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
  ) {
    console.log('🏗️ DashboardHomeComponent: Constructor ejecutado');
    console.log('📦 DashboardHomeComponent: eventService inyectado:', this.eventService);
  }

  /// <summary>
  /// Lifecycle init
  /// </summary>
  ngOnInit(): void {
    console.log('🔄 DashboardHomeComponent: ngOnInit()');
    this.getTotalCards();
    this.getTotalCardsConfigurations();
    this.getTotalEvents();
    this.loadUnitData();
    this.loadShiftData();
    this.loadEventsData();
    console.log('🔄 DashboardHomeComponent: Llamando loadEventTypesData()');
    this.loadEventTypesData();
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

  getTotalCardsConfigurations(): void {
    this.cardsService.GetTotalNumberOfIDCardConfigurationsAsync().subscribe({
      next: (result) => this.totalCardsCondigurations = result.data ?? 0,
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
  /// Load events by type (purple)
  /// </summary>
  loadEventTypesData(): void {
    console.log('📊 DashboardHomeComponent: Iniciando loadEventTypesData()');

    try {
      console.log('🔧 DashboardHomeComponent: Verificando eventService...', this.eventService);

      // Método alternativo de prueba con URL directa
      this.testDirectAPI();

    } catch (exception) {
      console.error('💥 DashboardHomeComponent: Exception en loadEventTypesData:', exception);
    }
  }

  /// <summary>
  /// Método de prueba con API directa para debugging
  /// </summary>
  testDirectAPI(): void {
    console.log('🧪 DashboardHomeComponent: Iniciando testDirectAPI()');

    // URL directa para pruebas
    const testUrl = '/api/Event/types/count';
    console.log('🔗 DashboardHomeComponent: URL de prueba:', testUrl);

    fetch(testUrl)
      .then(response => {
        console.log('📡 DashboardHomeComponent: Respuesta HTTP:', response.status, response.statusText);
        return response.json();
      })
      .then(data => {
        console.log('✅ DashboardHomeComponent: Datos directos recibidos:', data);
        this.eventTypesRawData = data.data || data || [];
        console.log('📊 DashboardHomeComponent: eventTypesRawData actualizado:', this.eventTypesRawData);

        // Crear gráfica con los datos directos
        this.updateEventTypesChart();
      })
      .catch(error => {
        console.error('❌ DashboardHomeComponent: Error en fetch directo:', error);
        // En caso de error, intentar con el servicio normal
        this.loadEventTypesDataViaService();
      });
  }

  /// <summary>
  /// Cargar datos via servicio normal
  /// </summary>
  loadEventTypesDataViaService(): void {
    console.log('🔄 DashboardHomeComponent: Intentando con servicio normal...');

    this.eventService.getEventsByType().subscribe({
      next: (res) => {
        console.log('✅ DashboardHomeComponent: Respuesta del servicio:', res);
        console.log('📊 DashboardHomeComponent: Datos del servicio:', res.data);

        this.eventTypesRawData = res.data || [];
        console.log('📊 DashboardHomeComponent: eventTypesRawData:', this.eventTypesRawData);

        this.updateEventTypesChart();
      },
      error: (err) => {
        console.error('❌ DashboardHomeComponent: Error loading event types data:', err);
        console.error('❌ DashboardHomeComponent: Error details:', err.message, err.status, err.url);

        // Crear gráfica vacía en caso de error
        this.eventTypesRawData = [];
        this.updateEventTypesChart();
      }
    });
  }

  /// <summary>
  /// Actualizar gráfica de tipos de evento
  /// </summary>
  updateEventTypesChart(): void {
    console.log('🎨 DashboardHomeComponent: Actualizando gráfica...');

    if (this.eventTypesRawData.length > 0) {
      console.log('🎨 DashboardHomeComponent: Creando gráfica con datos');
      const color = this.chartColors.eventTypes;
      const bg = this.buildColorArray(this.eventTypesRawData.length, color, 0.6);

      this.eventTypesChartData = {
        labels: this.eventTypesRawData.map(x => x.eventTypeName || 'Sin nombre'),
        datasets: [{
          label: 'Eventos',
          data: this.eventTypesRawData.map(x => x.totalEvents || 0),
          backgroundColor: bg,
          hoverBackgroundColor: this.withAlpha(color, 0.8),
          borderColor: this.withAlpha(color, 1),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      };

      console.log('🎯 DashboardHomeComponent: Gráfica creada:', this.eventTypesChartData);
    } else {
      console.log('⚠️ DashboardHomeComponent: No hay datos, creando gráfica vacía');
      this.eventTypesChartData = {
        labels: [],
        datasets: []
      };
    }
  }

  /// <summary>
  /// Método de prueba directa para drill-down
  /// </summary>
  testTopAttendanceDirect(typeId: number): void {
    console.log('🧪 DashboardHomeComponent: testTopAttendanceDirect() con typeId:', typeId);

    const testUrl = `https://api.carnetgo.site/api/Event/top-attendance-by-type/${typeId}?top=5`;
    console.log('🔗 DashboardHomeComponent: URL de prueba top attendance:', testUrl);

    // Primero intentar con fetch directo
    fetch(testUrl)
      .then(response => {
        console.log('📡 DashboardHomeComponent: Respuesta HTTP top attendance:', response.status, response.statusText);
        return response.json();
      })
      .then(data => {
        console.log('✅ DashboardHomeComponent: Datos directos de top attendance:', data);
        this.eventTopAttendanceRawData = data.data || data || [];
        console.log('📊 DashboardHomeComponent: eventTopAttendanceRawData actualizado:', this.eventTopAttendanceRawData);

        // Crear gráfica con los datos directos
        this.updateEventTopAttendanceChart();
      })
      .catch(error => {
        console.error('❌ DashboardHomeComponent: Error en fetch directo de top attendance:', error);
        console.log('📦 DashboardHomeComponent: Usando datos mock como fallback');

        // Fallback: usar datos mock basados en el tipo de evento
        this.useMockDataForType(typeId);
      });
  }

  /// <summary>
  /// Usar datos mock para el tipo de evento específico
  /// </summary>
  useMockDataForType(typeId: number): void {
    console.log('📦 DashboardHomeComponent: Creando datos mock para typeId:', typeId);

    // Datos mock por tipo de evento
    const mockData: { [key: number]: any[] } = {
      1: [ // Bienvenida
        { eventId: 1, eventName: "Bienvenida Nuevos Empleados", totalAttendees: 25 },
        { eventId: 2, eventName: "Ceremonia de Bienvenida", totalAttendees: 18 },
        { eventId: 3, eventName: "Recepción Corporativa", totalAttendees: 15 },
        { eventId: 4, eventName: "Evento de Integración", totalAttendees: 12 },
        { eventId: 5, eventName: "Presentación de Bienvenida", totalAttendees: 8 }
      ],
      2: [ // Planificación
        { eventId: 6, eventName: "Planificación Estratégica", totalAttendees: 30 },
        { eventId: 7, eventName: "Reunión de Planificación", totalAttendees: 20 },
        { eventId: 8, eventName: "Workshop de Planificación", totalAttendees: 16 },
        { eventId: 9, eventName: "Sesión de Planificación", totalAttendees: 14 },
        { eventId: 10, eventName: "Planificación de Proyectos", totalAttendees: 10 }
      ],
      3: [ // Capacitación
        { eventId: 11, eventName: "Capacitación en Software", totalAttendees: 45 },
        { eventId: 12, eventName: "Taller de Capacitación", totalAttendees: 35 },
        { eventId: 13, eventName: "Curso de Capacitación", totalAttendees: 28 },
        { eventId: 14, eventName: "Sesión de Capacitación", totalAttendees: 22 },
        { eventId: 15, eventName: "Entrenamiento Corporativo", totalAttendees: 18 }
      ],
      4: [ // Jornada de Estudio
        { eventId: 16, eventName: "Jornada de Estudio Técnico", totalAttendees: 20 },
        { eventId: 17, eventName: "Estudio de Caso", totalAttendees: 15 },
        { eventId: 18, eventName: "Análisis de Procesos", totalAttendees: 12 },
        { eventId: 19, eventName: "Investigación Grupal", totalAttendees: 10 },
        { eventId: 20, eventName: "Sesión de Aprendizaje", totalAttendees: 8 }
      ],
      5: [ // Jornada de Trabajo
        { eventId: 21, eventName: "Jornada de Trabajo Intensivo", totalAttendees: 32 },
        { eventId: 22, eventName: "Sesión de Trabajo", totalAttendees: 25 },
        { eventId: 23, eventName: "Taller Práctico", totalAttendees: 20 },
        { eventId: 24, eventName: "Ejercicio Grupal", totalAttendees: 16 },
        { eventId: 25, eventName: "Actividad de Trabajo", totalAttendees: 12 }
      ],
      6: [ // Taller
        { eventId: 26, eventName: "Taller de Herramientas", totalAttendees: 28 },
        { eventId: 27, eventName: "Taller Práctico Avanzado", totalAttendees: 24 },
        { eventId: 28, eventName: "Taller de Técnicas", totalAttendees: 19 },
        { eventId: 29, eventName: "Taller Ejecutivo", totalAttendees: 16 },
        { eventId: 30, eventName: "Taller de Desarrollo", totalAttendees: 13 }
      ],
      7: [ // Encuentro
        { eventId: 31, eventName: "Encuentro Anual", totalAttendees: 50 },
        { eventId: 32, eventName: "Encuentro de Equipos", totalAttendees: 35 },
        { eventId: 33, eventName: "Encuentro Regional", totalAttendees: 28 },
        { eventId: 34, eventName: "Encuentro Social", totalAttendees: 22 },
        { eventId: 35, eventName: "Encuentro Corporativo", totalAttendees: 18 }
      ]
    };

    // Obtener datos mock o usar datos por defecto
    this.eventTopAttendanceRawData = mockData[typeId] || [
      { eventId: 999, eventName: "Evento Mock", totalAttendees: 10 },
      { eventId: 998, eventName: "Evento Ejemplo", totalAttendees: 8 },
      { eventId: 997, eventName: "Evento Demo", totalAttendees: 6 },
      { eventId: 996, eventName: "Evento Test", totalAttendees: 4 },
      { eventId: 995, eventName: "Evento Prueba", totalAttendees: 2 }
    ];

    console.log('📦 DashboardHomeComponent: Datos mock generados:', this.eventTopAttendanceRawData);
    this.updateEventTopAttendanceChart();
  }

  /// <summary>
  /// Actualizar gráfica de top attendance
  /// </summary>
  updateEventTopAttendanceChart(): void {
    console.log('🎨 DashboardHomeComponent: Actualizando gráfica de top attendance...');

    if (this.eventTopAttendanceRawData.length > 0) {
      console.log('🎨 DashboardHomeComponent: Creando gráfica de top attendance con datos');
      const color = this.chartColors.eventTopAttendance;
      const bg = this.buildColorArray(this.eventTopAttendanceRawData.length, color, 0.6);

      this.eventTopAttendanceChartData = {
        labels: this.eventTopAttendanceRawData.map(x => x.eventName || 'Sin nombre'),
        datasets: [{
          label: 'Asistentes',
          data: this.eventTopAttendanceRawData.map(x => x.totalAttendees || 0),
          backgroundColor: bg,
          hoverBackgroundColor: this.withAlpha(color, 0.8),
          borderColor: this.withAlpha(color, 1),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      };

      console.log('🎯 DashboardHomeComponent: Gráfica de top attendance creada:', this.eventTopAttendanceChartData);
    } else {
      console.log('⚠️ DashboardHomeComponent: No hay datos de top attendance, creando gráfica vacía');
      this.eventTopAttendanceChartData = {
        labels: [],
        datasets: []
      };
    }
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
  /// On event type click -> load top attendance (cyan)
  /// </summary>
  onEventTypeClick(event: any): void {
    console.log('🖱️ DashboardHomeComponent: onEventTypeClick llamado', event);
    console.log('📊 DashboardHomeComponent: event.active:', event?.active);

    if (event?.active?.length > 0 && this.eventTypesRawData && this.eventTypesRawData.length > 0) {
      const index = event.active[0].index;
      console.log('🎯 DashboardHomeComponent: Índice de barra clickeada:', index);

      const typeId = this.eventTypesRawData[index]?.eventTypeId;
      console.log('🔍 DashboardHomeComponent: Type ID obtenido:', typeId);

      // Evitar recargar el mismo tipo
      if (typeId && typeId !== this.selectedEventTypeId) {
        this.selectedEventTypeId = typeId;
        console.log('📡 DashboardHomeComponent: Llamando getTopAttendanceByType con typeId:', typeId);

        // Primero intentar con el servicio
        this.eventService.getTopAttendanceByType(typeId, 5).subscribe({
          next: (res) => {
            console.log('✅ DashboardHomeComponent: Respuesta de top attendance:', res);

            this.eventTopAttendanceRawData = res || [];
            console.log('📊 DashboardHomeComponent: eventTopAttendanceRawData:', this.eventTopAttendanceRawData);
            this.updateEventTopAttendanceChart();
          },
          error: (err) => {
            console.error('❌ DashboardHomeComponent: Error con servicio, probando directo:', err);
            // Fallback: intentar con fetch directo
            this.testTopAttendanceDirect(typeId);
          }
        });
      } else if (typeId === this.selectedEventTypeId) {
        console.log('⚠️ DashboardHomeComponent: Tipo ya seleccionado, ignorando clic');
      } else {
        console.warn('⚠️ DashboardHomeComponent: No se pudo obtener typeId');
      }
    } else {
      console.warn('⚠️ DashboardHomeComponent: No hay barras activas o no hay datos de tipos de evento');
      console.log('📊 DashboardHomeComponent: eventTypesRawData:', this.eventTypesRawData);
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
