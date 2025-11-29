import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../../loanding/http-service-wrapper.service';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../Models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class ViewDatePersonCarnetService extends ApiService<any, any> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  getCompleteIssuedCardData(id: number): Observable<any> {
    return this.wrapper.handleRequest(this.http.get(`${this.urlBase}/IssuedCard/get-data-complete/${id}`));
  }

  getModificationsByUser(userId: number): Observable<ApiResponse<any>> {
    return this.wrapper.handleRequest(
      this.http.get<ApiResponse<any>>(`${this.urlBase}/ModificationRequest/by-user/${userId}`)
    );
  }

  getByUser(userId: number) {
  return this.http.get(`${this.urlBase}/ModificationRequest/by-user/${userId}`);
}

}