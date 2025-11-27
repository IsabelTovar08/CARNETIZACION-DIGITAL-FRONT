import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationalUnitCreate, OrganizationalUnitList, Branch, OrganizationalUnitWithBranchesCreate, AssignBranchDto, RemoveBranchDto, OrganizationalUnitDetail } from '../../../../Models/organization/organizationalUnit.models';
import { ApiResponse } from '../../../../Models/api-response.models';
import { ApiService } from '../../api.service';
import { HttpServiceWrapperService } from '../../../loanding/http-service-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationalUnitService extends ApiService<OrganizationalUnitCreate, OrganizationalUnitList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  /** Número de divisiones de la unidad organizativa */
  public GetOrganizationUnit() {
        return this.http.get<OrganizationalUnitCreate>(`${this.urlBase}/OrganizationalUnit/divisions/count`);
  }

  public GetDivisionsCount(orgUnitId: number) {
    return this.http.get<OrganizationalUnitCreate>(`${this.urlBase}/${orgUnitId}/divisions/count`);
  }

  /** Número de sucursales (branches) de la unidad organizativa */
  public GetBranchesCount(orgUnitId: number) {
    return this.http.get<OrganizationalUnitList>(`${this.urlBase}/${orgUnitId}/branches/count`);
  }

public GetInternalDivissionsByIdUnit(unitId: number) {
   return this.http.get<ApiResponse<OrganizationalUnitList>>(`${this.urlBase}/OrganizationalUnit/${unitId}/internal-divisions`);
 }


 public getActiveBranches() {
   return this.http.get<ApiResponse<Branch[]>>(`${this.urlBase}/Branch/Active`);
 }

 public createWithBranches(dto: OrganizationalUnitWithBranchesCreate) {
   return this.http.post(`${this.urlBase}/OrganizationalUnit/organizational-units/create-with-branches`, dto);
 }

 public assignBranch(dto: AssignBranchDto) {
   return this.http.post(`${this.urlBase}/OrganizationalUnit/branches/assign`, dto);
 }

 public removeBranch(dto: RemoveBranchDto) {
   return this.http.delete(`${this.urlBase}/OrganizationalUnit/branches/remove`, { body: dto });
 }

 public getDetail(unitId: number) {
   return this.http.get<ApiResponse<OrganizationalUnitDetail>>(`${this.urlBase}/OrganizationalUnit/${unitId}/detail`);
 }
}
