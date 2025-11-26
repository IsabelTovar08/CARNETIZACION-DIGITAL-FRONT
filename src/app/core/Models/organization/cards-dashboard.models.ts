//  DTO: Carnets por Unidad Organizativa
export interface CarnetsByUnit {
  unidadOrganizativaId: number;
  unidadOrganizativa: string;
  totalCarnets: number;
}

// El objeto que contiene total y la lista
export interface CarnetsByUnitResponse {
  total: number;
  data: CarnetsByUnit[];
}

//  DTO: Carnets por División Interna
export interface CarnetsByDivision {
  divisionInterna: string;
  totalCarnets: number;
}

//  DTO: Carnets por Jornada
export interface CarnetsByShedule {
  jornada: string;
  totalCarnets: number;
}

//  DTO: Eventos por Tipo
export interface EventsByType {
  eventTypeId: number;
  eventTypeName: string;
  totalEvents: number;
}

//  DTO: Top eventos con asistencia por tipo
export interface EventTopAttendance {
  eventId: number;
  eventName: string;
  totalAttendees: number;
}
