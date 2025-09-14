// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from '../../../../environments/environment';
// import { OrganizationalUnitCreate, OrganizationalUnitList } from '../../Models/organization/organizationalUnit.models';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrganizationalUnitCountService {

//   constructor(protected http: HttpClient) { }

//   urlBase = environment.URL + '/api';

//   /** Número de divisiones de la unidad organizativa */
//   public GetOrganizationUnit() {
//         return this.http.get<OrganizationalUnitCreate>(`${this.urlBase}/OrganizationalUnit/divisions/count`);
//   }

//   public GetDivisionsCount(orgUnitId: number) {
//     return this.http.get<OrganizationalUnitCreate>(`${this.urlBase}/${orgUnitId}/divisions/count`);
//   }

//   /** Número de sucursales (branches) de la unidad organizativa */
//   public GetBranchesCount(orgUnitId: number) {
//     return this.http.get<OrganizationalUnitList>(`${this.urlBase}/${orgUnitId}/branches/count`);
//   }

// }