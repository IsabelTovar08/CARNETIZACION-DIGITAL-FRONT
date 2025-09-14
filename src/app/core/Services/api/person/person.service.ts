import { PersonRegistrer } from '../../../Models/security/person.models';
import { Injectable } from '@angular/core';
import { PersonCreate, PersonList } from '../../../Models/security/person.models';
import { HttpClient } from '@angular/common/http';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends ApiService<PersonCreate, PersonList> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public SavePersonWithUser(person: PersonRegistrer){
    return this.http.post(`${this.urlBase}/Person/save-person-with-user`, person);
  }
}
