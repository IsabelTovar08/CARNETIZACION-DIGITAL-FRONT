import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../../../../Models/organization/organizationalUnit.models';
import { ApiResponse } from '../../../../Models/api-response.models';
import { ApiService } from '../../api.service';
import { HttpServiceWrapperService } from '../../../loanding/http-service-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends ApiService<Branch, Branch> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }
}