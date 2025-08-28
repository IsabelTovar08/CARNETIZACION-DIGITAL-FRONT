import { ApiResponse } from './../../../Models/api-response.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { CityCreate, CityList, Deparment } from '../../../Models/parameter/ubication.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  constructor(
    protected http: HttpClient,
  ) { }
  urlBase = environment.URL + '/api';

  public GetDeparments(){
    return this.http.get<ApiResponse<Deparment[]>>(`${this.urlBase}/Deparment`);
  }

  public GetCytiesByDeparment(id: number) :Observable<ApiResponse<CityList[]>>{
    return this.http.get<ApiResponse<CityList[]>>(`${this.urlBase}/City/city-by-deparment/${id}`);
  }

  public GetCities() : Observable<ApiResponse<CityList[]>>{
    return this.http.get<ApiResponse<CityList[]>>(`${this.urlBase}/City`);
  }

  // public GetCytiesByDeparment(id: number){
  //   return this.http.get<City[]>(`${this.urlBase}/City/city-by-deparment/${id}`);
  // }

}
