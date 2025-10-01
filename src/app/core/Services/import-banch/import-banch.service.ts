import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportBatch, ImportBatchRow, ImportBatchRowTable } from '../../Models/operational/import-banch.models';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../Models/api-response.models';

/**
 * Servicio para consultar lotes de importación (ImportBatch) y sus filas.
 */
@Injectable({
  providedIn: 'root'
})
export class ImportBatchService {
  /** Endpoint base para el API de ImportBatch */
  private baseUrl = environment.URL + '/api/importbatch';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los lotes de importación.
   */
  getAll(): Observable<ApiResponse<ImportBatch[]>> {
    return this.http.get<ApiResponse<ImportBatch[]>>(this.baseUrl);
  }

  /**
   * Obtiene un lote específico por Id.
   * @param id Identificador del lote
   */
  getById(id: number): Observable<ApiResponse<ImportBatch>> {
    return this.http.get<ApiResponse<ImportBatch>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene todas las filas de un lote.
   * @param id Identificador del lote
   */
  getRowsForTable(batchId: number): Observable<ApiResponse<ImportBatchRowTable[]>> {
    return this.http.get<ApiResponse<ImportBatchRowTable[]>>(`${this.baseUrl}/${batchId}/rows`);
  }

  /**
   * Obtiene solo las filas con error de un lote.
   * @param id Identificador del lote
   */
  getErrorRows(id: number): Observable<ApiResponse<ImportBatchRow[]>> {
    return this.http.get<ApiResponse<ImportBatchRow[]>>(`${this.baseUrl}/${id}/rows/errors`);
  }
}
