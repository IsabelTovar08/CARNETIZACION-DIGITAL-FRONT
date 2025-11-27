import { Injectable } from "@angular/core";
import { ApiService } from "../../api.service";
import { HttpClient } from "@angular/common/http";
import { HttpServiceWrapperService } from "../../../loanding/http-service-wrapper.service";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../../Models/api-response.models";

@Injectable({
  providedIn: 'root'
})
export class IssuedCardService extends ApiService<any, any> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  public getCardPdf(issuedCardId: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.wrapper.handleRequest(
      this.http.get(`${this.urlBase}/IssuedCard/generate/${issuedCardId}`, {
        headers,
        responseType: 'blob'
      })
    );
  }

  public getinfoUser(issuedCardId: number): Observable<ApiResponse<any>> {
    return this.wrapper.handleRequest(
      this.http.get<ApiResponse<any>>(`${this.urlBase}/IssuedCard/get-data-complete/${issuedCardId}`)
    );
  }
}