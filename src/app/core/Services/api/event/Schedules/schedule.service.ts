import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../../loanding/http-service-wrapper.service';
import { ApiService } from '../../api.service';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../Models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends ApiService<any, any> {

  private daysEsToEn: Record<string, string> = {
    lunes: 'Monday',
    martes: 'Tuesday',
    miércoles: 'Wednesday',
    miercoles: 'Wednesday',
    jueves: 'Thursday',
    viernes: 'Friday',
    sábado: 'Saturday',
    sabado: 'Saturday',
    domingo: 'Sunday'
  };

  private daysEnToEs: Record<string, string> = {
  Monday: 'lunes',
  Tuesday: 'martes',
  Wednesday: 'miércoles',
  Thursday: 'jueves',
  Friday: 'viernes',
  Saturday: 'sábado',
  Sunday: 'domingo'
};


  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  private translateDays(days: string[]): string[] {
    return days.map(d => this.daysEsToEn[d.toLowerCase()] || d);
  }

  public createSchedule(dto: any): Observable<ApiResponse<any>> {
    const payload = {
      ...dto,
      days: this.translateDays(dto.days)
    };
    return this.wrapper.handleRequest(this.http.post<ApiResponse<any>>(`${this.urlBase}/Schedule`, payload));
  }

  public updateSchedule(dto: any): Observable<ApiResponse<any>> {
    const payload = {
      ...dto,
      days: this.translateDays(dto.days)
    };
    return this.wrapper.handleRequest(this.http.put<ApiResponse<any>>(`${this.urlBase}/Schedule/update`, payload));
  }

  private translateDaysBack(days: string[]): string[] {
  return days.map(d => this.daysEnToEs[d] || d);
}
public getAll(): Observable<ApiResponse<any>> {
    return this.wrapper.handleRequest(
      this.http.get<ApiResponse<any>>(`${this.urlBase}/Schedule`)
    ).pipe(
      map(resp => ({
        ...resp,
        data: resp.data?.map((s: any) => ({
          ...s,
          days: this.translateDaysBack(s.days || [])
        }))
      }))
    );
  }

  public getById(id: number): Observable<ApiResponse<any>> {
    return this.wrapper.handleRequest(
      this.http.get<ApiResponse<any>>(`${this.urlBase}/Schedule/${id}`)
    ).pipe(
      map(resp => ({
        ...resp,
        data: resp.data
          ? {
              ...resp.data,
              days: this.translateDaysBack(resp.data.days || [])
            }
          : null
      }))
    );
  }
}
  