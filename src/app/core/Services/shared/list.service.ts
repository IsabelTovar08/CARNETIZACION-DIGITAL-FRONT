import { CityList } from './../../Models/parameter/ubication.models';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { CustomTypeService } from '../api/customType/custom-type.service';
import { UbicationService } from '../api/ubication/ubication.service';
import { CustomTypeSpecific } from '../../Models/parameter/custom-type.models';
import { CityCreate, Deparment } from '../../Models/parameter/ubication.models';
import { ApiService } from '../api/api.service';
import { ScheduleCreate, ScheduleList } from '../../Models/organization/schedules.models';
import { ScheduleService } from '../api/organizational/schedule.service';
// import { OrganizationalUnit } from '../../Models/organization/organizationalUnit.models';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private customTypeService: CustomTypeService,
    private ubicationService: UbicationService,
    private scheduleService: ScheduleService,
    private cityService: ApiService<CityCreate, CityList>,
    private scheduleApi: ApiService<ScheduleCreate, ScheduleList>,
    // private organizationalUnitService: ApiService<OrganizationalUnit, OrganizationalUnit>
  ) { }

  // --- Datos estáticos ---
  private documentTypes$?: Observable<CustomTypeSpecific[]>;
  private bloodTypes$?: Observable<CustomTypeSpecific[]>;
  private deparments$?: Observable<Deparment[]>;
  private cities$?: Observable<CityList[]>;
  private schedules$?: Observable<ScheduleList[]>;
  // private organizationunit$?: Observable<OrganizationalUnit[]>;


  getdocumentTypes(forceReload: boolean = false): Observable<any[]> {
    if (forceReload || !this.documentTypes$) {
      this.documentTypes$ = this.customTypeService
        .GetByName('Tipo de documento')
        .pipe(shareReplay(1));
    }
    return this.documentTypes$;
  }

  getbloodTypes(forceReload: boolean = false): Observable<any[]> {
    if (forceReload || !this.bloodTypes$) {
      this.bloodTypes$ = this.customTypeService
        .GetByName('Tipo de sangre')
        .pipe(shareReplay(1));
    }
    return this.bloodTypes$;
  }

  getdeparments(forceReload: boolean = false): Observable<any[]> {
    if (forceReload || !this.deparments$) {
       this.deparments$ = this.ubicationService
        .GetDeparments()
         .pipe(
        map((res) => res.data ?? []),
        shareReplay(1) // cachear la última emisión
      );
    }
    return this.deparments$;
  }

  getCities(forceReload: boolean = false): Observable<CityList[]> {
  if (forceReload || !this.cities$) {
    this.cities$ = this.ubicationService
      .GetCities() //
      .pipe(
        map((res) => res.data ?? []),
        shareReplay(1) // cachear la última emisión
      );
  }
  return this.cities$;
}

  getSchedules(forceReload = false): Observable<ScheduleList[]> {
    if (forceReload || !this.schedules$) {
      this.schedules$ = this.scheduleService
        .GetAllSchedules()
        .pipe(
          map(res => Array.isArray(res) ? res : (res?.data ?? [])),
          shareReplay(1)
        );
    }
    return this.schedules$!; // non-null assertion para el tipo
  }
}
  // getorganizationalUnits(forceReload: boolean = false): Observable<any[]> {
  //   if (forceReload || !this.organizationunit$) {
  //     this.organizationunit$ = this.organizationalUnitService
  //       .GetDivisionsCount()
  //       .pipe(shareReplay(1));
  //   }
  //   return this.organizationunit$;
  // }


