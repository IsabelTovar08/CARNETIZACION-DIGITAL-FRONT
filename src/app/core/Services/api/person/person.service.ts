import { PersonRegistrer } from '../../../Models/security/person.models';
import { Injectable } from '@angular/core';
import { PersonCreate, PersonList } from '../../../Models/security/person.models';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';
import { ScheduleList } from '../../../Models/organization/schedules.models';
import { ApiResponse } from '../../../Models/api-response.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends ApiService<PersonCreate, PersonList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public SavePersonWithUser(person: PersonRegistrer){
    return this.wrapper.handleRequest(this.http.post(`${this.urlBase}/Person/save-person-with-user`, person));
  }

  public SavePhoto(file: File) : Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.wrapper.handleRequest(this.http.post(`${this.urlBase}/Person/7/photo`, formData));
  }

}
