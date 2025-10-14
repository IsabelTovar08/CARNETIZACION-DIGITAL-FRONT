import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';

interface BranchFromApi {
  id: number;
  name: string;
  address: string;
  location: string;     // "lat,lon"
  zone?: string | null;
  schedule?: string | null;
}

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class SucursalComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;

  private map!: L.Map;
  private marker!: L.Marker;
  private http = inject(HttpClient);
  private allMarkers: L.Marker[] = [];

  searchQuery: string = '';
  sucursalSeleccionada: any = null;

  /** 🌍 Sucursales locales (fijas) */
  private localBranches: BranchFromApi[] = [
    {
      id: 0,
      name: 'Sucursal Norte',
      address: 'Calle 18 #67-45 Oriente',
      schedule: '05:00 AM - 04:00 PM',
      location: '4.690,-74.080',
      zone: 'Norte'
    },
    {
      id: 0,
      name: 'Sucursal Centro',
      address: 'Av Siempre Viva #742',
      schedule: '08:00 AM - 05:00 PM',
      location: '4.6097,-74.0817',
      zone: 'Centro'
    },
    {
      id: 0,
      name: 'Sucursal Sur',
      address: 'Cra 10 #23-45 Centro',
      schedule: '09:00 AM - 06:00 PM',
      location: '4.530,-74.100',
      zone: 'Sur'
    }
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  /** 🗺️ Inicializa mapa */
  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([4.5709, -74.2973], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Locales + Backend (sin cerrar ningún Swal)
    this.loadLocalBranches();
    this.loadBranchesFromApi({ showAlert: false, closeLoader: false });

    // Clic en mapa → marcador temporal
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.setSearchMarker(lat, lng);
      this.reverseGeocode(lat, lng);
    });
  }

  /** 📍 Cargar locales */
  private loadLocalBranches() {
    this.localBranches.forEach((b: BranchFromApi) => {
      const [lat, lon] = b.location.split(',').map(Number);
      this.addBranchMarker({
        id: b.id, name: b.name, address: b.address,
        latitude: lat, longitude: lon,
        zone: b.zone ?? 'Sin zona', schedule: b.schedule ?? 'No definido'
      });
    });
  }

  /** 🔄 Botón Recargar (con loader controlado) */
  recargarSucursales() {
    Swal.fire({
      title: '🔄 Recargando sucursales...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Limpia todos los pines
    this.allMarkers.forEach(m => this.map.removeLayer(m));
    this.allMarkers = [];

    // Vuelve a pintar locales
    this.loadLocalBranches();

    // Ahora backend y cuando termine cierra el loader y muestra resumen
    this.loadBranchesFromApi({ showAlert: true, closeLoader: true });
  }

  /**
   * 🌐 Carga sucursales del backend
   * - showAlert: muestra resumen al terminar
   * - closeLoader: cierra el Swal que esté abierto (solo lo uso en Recargar)
   */
  private loadBranchesFromApi(opts: { showAlert: boolean; closeLoader: boolean }) {
    const url = `${environment.URL}/api/Branch`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        const arr: BranchFromApi[] = Array.isArray(response)
          ? response
          : (response?.data ?? []);

        if (!arr || arr.length === 0) {
          if (opts.showAlert) Swal.fire('Sin datos', 'No se encontraron sucursales en la API.', 'info');
          if (opts.closeLoader) Swal.close();
          return;
        }

        let added = 0;
        arr.forEach((b: BranchFromApi) => {
          if (!b.location || !b.location.includes(',')) return;

          const clean = b.location.replace(';', ',').replace(/\s/g, '');
          const [lat, lon] = clean.split(',').map(parseFloat);
          if (isNaN(lat) || isNaN(lon)) return;

          this.addBranchMarker({
            id: b.id,
            name: b.name,
            address: b.address,
            latitude: lat,
            longitude: lon,
            zone: b.zone ?? 'Sin zona',
            schedule: b.schedule ?? 'No definido'
          });
          added++;
        });

        if (opts.showAlert) Swal.fire('✅ Listo', `${added} sucursal(es) cargadas desde la API`, 'success');
        if (opts.closeLoader) Swal.close();
      },
      error: (err) => {
        console.error('Error al cargar sucursales:', err);
        if (opts.closeLoader) Swal.close();
        Swal.fire('❌ Error', 'No se pudieron obtener las sucursales desde el servidor.', 'error');
      }
    });
  }

  /** 🔵 Pin azul y popup */
  private addBranchMarker(branch: {
    id: number; name: string; address: string;
    latitude: number; longitude: number;
    zone: string; schedule: string;
  }) {
    const bluePin = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -30]
    });

    const marker = L.marker([branch.latitude, branch.longitude], { icon: bluePin })
      .addTo(this.map)
      .bindPopup(`
        <b>${branch.name}</b><br>
        ${branch.address ?? ''}<br>
        <b>Zona:</b> ${branch.zone}<br>
        <b>Horario:</b> ${branch.schedule}
      `);

    marker.on('click', () => (this.sucursalSeleccionada = branch));
    this.allMarkers.push(marker);
  }

  /** 🟢 Pin temporal de búsqueda */
  private setSearchMarker(lat: number, lng: number) {
    if (this.marker) this.map.removeLayer(this.marker);
    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -30]
    });
    this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
  }

  /** 🔍 Buscar dirección */
  buscarDireccion(): void {
    if (!this.searchQuery.trim()) {
      Swal.fire('Campo vacío', 'Por favor escribe una dirección o ciudad', 'warning');
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      this.searchQuery
    )}&addressdetails=1&countrycodes=co&limit=1`;

    Swal.fire({
      title: 'Buscando dirección...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        Swal.close();
        if (!data.length) {
          Swal.fire('No encontrado', 'No se encontró ninguna ubicación', 'error');
          return;
        }

        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const display = result.display_name;

        this.map.setView([lat, lon], 16);
        this.setSearchMarker(lat, lon);
        this.askToRegisterBranch(display, lat, lon);
      },
      error: () => {
        Swal.close();
        Swal.fire('Error', 'No se pudo conectar al servicio de búsqueda', 'error');
      }
    });
  }

  /** 🏢 Modal de registro */
  private askToRegisterBranch(address: string, lat: number, lon: number) {
    Swal.fire({
      title: 'Registrar nueva sucursal',
      html: `
        <input id="sw-name" class="swal2-input" placeholder="Nombre de la sucursal">
        <input id="sw-phone" class="swal2-input" placeholder="Teléfono">
        <input id="sw-email" class="swal2-input" placeholder="Correo electrónico">
        <input id="sw-address" class="swal2-input" value="${address}" placeholder="Dirección">
        <select id="sw-zone" class="swal2-input">
          <option value="">Seleccionar zona</option>
          <option value="Norte">Zona Norte</option>
          <option value="Sur">Zona Sur</option>
          <option value="Oriente">Zona Oriente</option>
          <option value="Occidente">Zona Occidente</option>
        </select>
        <div style="display:flex; gap:8px; justify-content:center;">
          <input id="sw-open" type="time" class="swal2-input" style="width:45%;" placeholder="Hora apertura">
          <input id="sw-close" type="time" class="swal2-input" style="width:45%;" placeholder="Hora cierre">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('sw-name') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('sw-phone') as HTMLInputElement).value.trim();
        const email = (document.getElementById('sw-email') as HTMLInputElement).value.trim();
        const addressVal = (document.getElementById('sw-address') as HTMLInputElement).value.trim();
        const zone = (document.getElementById('sw-zone') as HTMLSelectElement).value;
        const open = (document.getElementById('sw-open') as HTMLInputElement).value;
        const close = (document.getElementById('sw-close') as HTMLInputElement).value;

        if (!name || !phone || !email || !zone) {
          Swal.showValidationMessage('Completa todos los campos obligatorios');
          return false; // ⬅️ NO cerrar el modal
        }

        const schedule = open && close ? `Abre: ${open} - Cierra: ${close}` : 'Horario no definido';
        return { name, phone, email, address: addressVal, zone, schedule };
      }
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        const data: BranchFromApi & { cityId: number; organizationId: number } = {
          id: 0,
          name: res.value.name,
          location: `${lat},${lon}`,
          phone: res.value.phone,
          email: res.value.email,
          address: res.value.address,
          cityId: 1,
          organizationId: 1,
          zone: res.value.zone,
          schedule: res.value.schedule
        } as any;

        this.registerBranch(data, lat, lon);
      }
    });
  }

  /** 💾 POST al backend (con loader propio) */
  private registerBranch(data: any, lat: number, lon: number) {
    const url = `${environment.URL}/api/Branch`;

    Swal.fire({
      title: 'Guardando sucursal...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post(url, data).subscribe({
      next: () => {
        Swal.close();
        Swal.fire('✅ Registrada', 'Sucursal registrada exitosamente', 'success');
        this.addBranchMarker({
          id: 0,
          name: data.name,
          address: data.address,
          latitude: lat,
          longitude: lon,
          zone: data.zone ?? 'Sin zona',
          schedule: data.schedule ?? 'No definido'
        });
      },
      error: () => {
        Swal.close();
        Swal.fire('Error', 'No se pudo registrar la sucursal', 'error');
      }
    });
  }

  cerrarModal() {
    this.sucursalSeleccionada = null;
  }

  private reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    this.http.get<any>(url).subscribe({
      next: (data) => console.log('📍 Dirección:', data.display_name),
      error: () => console.warn('No se pudo obtener la dirección automáticamente.')
    });
  }
}
