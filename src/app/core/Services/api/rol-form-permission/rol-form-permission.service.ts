import { RolFormPermissionsCreate, RolFormPermissionsList } from '../../../Models/security/rol-form-permission.models';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { Observable } from 'rxjs';
import { RoleFormPermisionsRequest } from '../../../Models/security/role.models';
import { ApiResponse } from '../../../Models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class RolFormPermissionService extends ApiService<RolFormPermissionsCreate, RolFormPermissionsList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public getAllPermissions(): Observable<ApiResponse<RolFormPermissionsList[]>> {
    return this.wrapper.handleRequest(this.http.get<ApiResponse<RolFormPermissionsList[]>>(`${this.urlBase}/RolFormPermission/all`));
  }

  public savePermissions(request: RoleFormPermisionsRequest) {
    return this.wrapper.handleRequest(this.http.post<boolean>(`${this.urlBase}/RolFormPermission/saveAll`, request));
  }
}
