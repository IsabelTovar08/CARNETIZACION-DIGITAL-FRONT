import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { fromApiTime } from '../../../../../../core/utils/time-only';
import { GenericFormComponent } from '../../../../../../shared/components/generic-form/generic-form.component';
import { MatDialog } from '@angular/material/dialog';

interface BranchFromApi {
  id: number;
  name: string;
  address: string;
  location: string;     // "lat,lon"
  zone?: string | null;
  schedule?: string | null;
  phone?: string | null;
  email?: string | null;
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
  private allMarkers: { id: number; marker: L.Marker }[] = [];

  searchQuery: string = '';
  sucursalSeleccionada: any = null;

  constructor(private dialog: MatDialog) {}

  /**  Sucursales locales (fijas) */
  private localBranches: BranchFromApi[] = [
    {
      id: 0,
      name: 'Sucursal Norte',
      address: 'Calle 18 #67-45 Oriente',
      schedule: '05:00 AM - 04:00 PM',
      location: '4.690,-74.080',
      zone: 'Norte',
      phone: '3001234567',
      email: 'norte@empresa.com'
    },
    {
      id: 0,
      name: 'Sucursal Centro',
      address: 'Av Siempre Viva #742',
      schedule: '08:00 AM - 05:00 PM',
      location: '4.6097,-74.0817',
      zone: 'Centro',
      phone: '3009876543',
      email: 'centro@empresa.com'
    },
    {
      id: 0,
      name: 'Sucursal Sur',
      address: 'Cra 10 #23-45 Centro',
      schedule: '09:00 AM - 06:00 PM',
      location: '4.530,-74.100',
      zone: 'Sur',
      phone: '3011122334',
      email: 'sur@empresa.com'
    }
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**  Inicializa mapa */
  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([4.5709, -74.2973], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.loadLocalBranches();
    this.loadBranchesFromApi({ showAlert: false, closeLoader: false });

    // Clic en mapa → marcador temporal
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.setSearchMarker(lat, lng);
      this.reverseGeocode(lat, lng);
    });
  }

  /**  Cargar sucursales locales */
  private loadLocalBranches() {
    this.localBranches.forEach((b: BranchFromApi) => {
      const [lat, lon] = b.location.split(',').map(Number);
      this.addBranchMarker({
        id: b.id,
        name: b.name,
        address: b.address,
        latitude: lat,
        longitude: lon,
        zone: b.zone ?? 'Sin zona',
        schedule: b.schedule ?? 'No definido'
      });
    });
  }

  /**  Botón Recargar */
  recargarSucursales() {
    Swal.fire({
      title: '🔄 Recargando sucursales...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.allMarkers.forEach(m => this.map.removeLayer(m.marker));
    this.allMarkers = [];

    this.loadLocalBranches();
    this.loadBranchesFromApi({ showAlert: true, closeLoader: true });
  }

  /** Cargar sucursales del backend */
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

          const marker = this.addBranchMarker({
            id: b.id,
            name: b.name,
            address: b.address,
            latitude: lat,
            longitude: lon,
            zone: b.zone ?? 'Sin zona',
            schedule: b.schedule ?? 'No definido'
          });

          // Agregar botón editar al popup
          marker.on('popupopen', () => {
            const popupContent = `
              <div style="text-align:left;">
                <b>${b.name}</b><br>
                ${b.address}<br>
                <b>Teléfono:</b> ${b.phone ?? ''}<br>
                <b>Correo:</b> ${b.email ?? ''}<br><br>
                <button id="edit-${b.id}" 
                  style="background:#2563eb;color:white;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;">
                  ✏️ Editar
                </button>
              </div>`;
            marker.setPopupContent(popupContent);

            setTimeout(() => {
              const btn = document.getElementById(`edit-${b.id}`);
              if (btn) btn.addEventListener('click', () => this.openModal(b));
            }, 50);
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

  /**  Agregar marcador azul */
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
    this.allMarkers.push({ id: branch.id, marker });
    return marker;
  }

  /**  Marcador temporal */
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

  /** Buscar dirección */
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

  /**  Abrir modal de registro */
  private askToRegisterBranch(address: string, lat: number, lon: number) {
    const item: BranchFromApi = {
      id: 0,
      name: '',
      address: address,
      location: `${lat},${lon}`,
      zone: '',
      phone: '',
      email: ''
    };
    this.openModal(item);
  }

  /**  Modal genérico */
  openModal(item?: BranchFromApi) {
    const isEditing = !!item?.id && !!item?.name;

    const dialogRef = this.dialog.open(GenericFormComponent, {
      disableClose: true,
      width: window.innerWidth < 768 ? '95vw' : '400px',
      maxHeight: '95vh',
      data: {
        title: isEditing ? 'Editar Sucursal' : 'Crear Sucursal',
        item,
        fields: [
          { name: 'name', label: 'Nombre', type: 'text', value: item?.name || '', required: true },
          { name: 'address', label: 'Dirección', type: 'text', value: item?.address || '', required: true, readonly: true },
          { name: 'phone', label: 'Teléfono', type: 'text', value: item?.phone || '', required: true },
          { name: 'email', label: 'Correo electrónico', type: 'email', value: item?.email || '', required: true },
          { name: 'zone', label: 'Zona', type: 'text', value: item?.zone || '', required: false },
          { name: 'startTime', label: 'Hora inicio', type: 'time', value: fromApiTime(item?.schedule || ''), required: false },
          { name: 'endTime', label: 'Hora fin', type: 'time', value: fromApiTime(item?.schedule || ''), required: false },
        ],
        replaceBaseFields: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEditing && item) {
          this.updateBranch(item, result);
        } else {
          const [lat, lon] = (item?.location ?? '0,0').split(',').map(Number);
          const data = {
            id: 0,
            name: result.name,
            address: result.address,
            phone: result.phone,
            email: result.email,
            location: `${lat},${lon}`,
            cityId: 1,
            organizationId: 1
          };
          this.registerBranch(data, lat, lon);
        }
      }
    });
  }

  /** 💾 POST al backend */
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
        this.loadBranchesFromApi({ showAlert: false, closeLoader: false });
      },
      error: (err) => {
        Swal.close();
        console.error('❌ Error al registrar sucursal:', err);
        Swal.fire('Error', 'No se pudo registrar la sucursal', 'error');
      }
    });
  }

  /** PUT actualizar sucursal (API + mapa) */
  private updateBranch(item: BranchFromApi, result: any) {
    const url = `${environment.URL}/api/Branch/update`; //  ruta correcta

    const [lat, lon] = (item.location ?? '0,0').split(',').map(Number);

    const updated = {
      id: item.id,
      name: result.name ?? item.name,
      phone: result.phone ?? '',
      email: result.email ?? '',
      address: item.address ?? '',
      location: `${lat},${lon}`,
      cityId: 1,
      organizationId: 1
    };

    Swal.fire({
      title: 'Actualizando sucursal...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.put(url, updated).subscribe({
      next: () => {
        Swal.close();
        Swal.fire('✅ Actualizada', 'Sucursal actualizada correctamente', 'success');

        // 🔹 Actualizar popup sin recargar
        const found = this.allMarkers.find(m => m.id === item.id);
        if (found) {
          found.marker.setPopupContent(`
            <b>${updated.name}</b><br>
            ${updated.address}<br>
            <b>Teléfono:</b> ${updated.phone}<br>
            <b>Correo:</b> ${updated.email}
          `);
        }
      },
      error: (err) => {
        Swal.close();
        console.error(' Error al actualizar sucursal:', err);
        Swal.fire('Error', err.error?.message || 'No se pudo actualizar la sucursal', 'error');
      }
    });
  }

  cerrarModal() {
    this.sucursalSeleccionada = null;
  }

  /**  Reverse Geocoding */
  private reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    this.http.get<any>(url).subscribe({
      next: (data) => console.log(' Dirección detectada:', data.display_name),
      error: () => console.warn('No se pudo obtener la dirección automáticamente.')
    });
  }
}
