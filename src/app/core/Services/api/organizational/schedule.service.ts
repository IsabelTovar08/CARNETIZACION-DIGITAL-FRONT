import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';
import { ScheduleCreate, ScheduleList } from '../../../Models/organization/schedules.models';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../Models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends ApiService<ScheduleCreate, ScheduleList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  } 

   public GetAllSchedules(): Observable<ApiResponse<ScheduleList[]>> {
    return this.http.get<ApiResponse<ScheduleList[]>>(`${this.urlBase}/Schedule`);
  }

}