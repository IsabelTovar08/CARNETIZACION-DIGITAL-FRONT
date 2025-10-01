/**
 * Representa un lote de importación.
 */
export interface ImportBatch {
  /** Identificador del lote */
  id: number;

  /** Nombre del archivo importado */
  fileName?: string;

  /** Origen de la importación */
  source: string;

  /** Usuario que inició la importación */
  startedBy?: string;

  /** Total de filas procesadas */
  totalRows: number;

  /** Número de filas exitosas */
  successCount: number;

  /** Número de filas con error */
  errorCount: number;

  /** Fecha de inicio del proceso */
  startedAt: string;

  /** Fecha de finalización del proceso */
  endedAt?: string;
}

/**
 * Representa una fila dentro de un lote de importación (ImportBatchRowDetailDto).
 */
export interface ImportBatchRow {
  /** Identificador de la fila */
  id: number;

  /** Número de fila en el archivo Excel */
  rowNumber: number;

  /** Indica si fue procesada exitosamente */
  success: boolean;

  /** Mensaje del resultado */
  message?: string;

  /** Id de la persona creada */
  personId?: number;

  /** Id de la relación Persona–División–Perfil */
  personDivisionProfileId?: number;

  /** Id del carnet generado */
  cardId?: number;

  /** Indica si se actualizó la foto */
  updatedPhoto: boolean;
}

/**
 * DTO resumido para mostrar en la tabla de importación masiva.
 */
export interface ImportBatchRowTable {
  rowNumber: number;
  photo?: string;
  name: string;
  org: string;
  division: string;
  state: string;
  isDeleted: boolean;
}
