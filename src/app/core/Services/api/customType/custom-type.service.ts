import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { CustomTypeCreate, CustomTypeList, CustomTypeSpecific } from '../../../Models/parameter/custom-type.models';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomTypeService extends ApiService<CustomTypeCreate, CustomTypeList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public GetByName(name: string) : Observable<CustomTypeSpecific[]> {
    return this.http.get<CustomTypeSpecific[]>(`${this.urlBase}/CustomType/get-by-name/${name}`);
  }
}
