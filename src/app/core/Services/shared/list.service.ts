import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { CustomTypeService } from '../api/custom-type.service';
import { UbicationService } from '../api/ubication.service';
import { CustomTypeSpecific } from '../../Models/parameter/custom-type.models';
import { City, Deparment } from '../../Models/parameter/ubication.models';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private customTypeService: CustomTypeService,
    private ubicationService: UbicationService
  ) { }

  // --- Datos estáticos ---
  private documentTypes$?: Observable<CustomTypeSpecific[]>;
  private bloodTypes$?: Observable<CustomTypeSpecific[]>;
  private deparments$?: Observable<Deparment[]>;
  private cities$?: Observable<City[]>;


  getdocumentTypes(): Observable<any[]> {
    if (!this.documentTypes$) {
      this.documentTypes$ = this.customTypeService.GetByName('Tipo de documento')
        .pipe(shareReplay(1));
    }
    return this.documentTypes$;
  }

  getbloodTypes(): Observable<any[]> {
    if (!this.bloodTypes$) {
      this.bloodTypes$ = this.customTypeService.GetByName('Tipo de sangre')
        .pipe(shareReplay(1));
    }
    return this.bloodTypes$;
  }

  getdeparments(): Observable<any[]> {
    if (!this.deparments$) {
      this.deparments$ = this.ubicationService.GetDeparments()
        .pipe(shareReplay(1));
    }
    return this.deparments$;
  }

  // getCities(): Observable<any[]> {
  //   if (!this.deparments$) {
  //     this.deparments$ = this.ubicationService.getc()
  //       .pipe(shareReplay(1));
  //   }
  //   return this.deparments$;
  // }

}
