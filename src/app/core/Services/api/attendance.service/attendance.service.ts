import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { AttendanceResponse } from "../../../Models/operational/attendance.model";

@Injectable({
  providedIn: 'root'
})

export class AttendanceService {
  private http = inject(HttpClient);
  private urlBase = environment.API_BASE_URL + '/api';

  searchAttendance(params: {
    eventId: number;
    sortBy?: string;
    sortDir?: string;
    page?: number;
    pageSize?: number;
    personId?: number;
    fromUtc?: string;
    toUtc?: string;
  }): Observable<AttendanceResponse> {
    let httpParams = new HttpParams();

    if (params.eventId !== undefined) {
      httpParams = httpParams.set('eventId', params.eventId.toString());
    }
    if (params.sortBy !== undefined) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortDir !== undefined) {
      httpParams = httpParams.set('sortDir', params.sortDir);
    }
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.personId !== undefined) {
      httpParams = httpParams.set('personId', params.personId.toString());
    }
    if (params.fromUtc !== undefined) {
      httpParams = httpParams.set('fromUtc', params.fromUtc);
    }
    if (params.toUtc !== undefined) {
      httpParams = httpParams.set('toUtc', params.toUtc);
    }

    return this.http.get<AttendanceResponse>(`${this.urlBase}/Attendance/search`, { params: httpParams });
  }
}