import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { MenuItem, MenuStructure } from '../../../Models/MenuItemModel';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends ApiService<MenuStructure, MenuItem>{

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public GetMenuByUser() :Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(`${this.urlBase}/MenuStructure/menu-by-user`);
  }
}
