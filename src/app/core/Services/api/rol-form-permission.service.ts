import { RolFormPermissionsCreate, RolFormPermissionsList } from './../../Models/security/rol-form-permission.models';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../loanding/http-service-wrapper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolFormPermissionService extends ApiService<RolFormPermissionsCreate, RolFormPermissionsList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public getAllPermissions(): Observable<RolFormPermissionsList[]> {
    return this.http.get<RolFormPermissionsList[]>(`${this.urlBase}/RolFormPermission/permisos-completos`);
  }
}
