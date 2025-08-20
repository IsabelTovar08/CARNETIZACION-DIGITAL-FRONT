import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { CityCreate, CityList, Deparment } from '../../../Models/parameter/ubication.models';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  constructor(
    protected http: HttpClient,
  ) { }
  urlBase = environment.URL + '/api';

  public GetDeparments(){
    return this.http.get<Deparment[]>(`${this.urlBase}/Deparment`);
  }

  public GetCytiesByDeparment(id: number){
    return this.http.get<CityCreate[]>(`${this.urlBase}/City/city-by-deparment/${id}`);
  }

  public GetCities(){ 
    return this.http.get<CityList[]>(`${this.urlBase}/City`);
  }

  // public GetCytiesByDeparment(id: number){
  //   return this.http.get<City[]>(`${this.urlBase}/City/city-by-deparment/${id}`);
  // }

}
