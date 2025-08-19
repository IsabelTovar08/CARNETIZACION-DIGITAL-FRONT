import { Injectable } from '@angular/core';
import { UserRolCreate, UserRolCreateAll, UserRolList } from '../../../Models/security/user-roles.models';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService extends ApiService<UserRolCreate, UserRolList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public saveAllRoles(request: UserRolCreateAll) {
    return this.wrapper.handleRequest(this.http.post<boolean>(`${this.urlBase}/UserRol/saveAll`, request));
  }
}
