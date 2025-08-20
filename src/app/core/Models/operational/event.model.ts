import { GenericModel } from "../security/generic.model";

export interface Event extends GenericModel {
  code: string;

  scheduleDate?: Date;   // Fecha programada
  scheduleTime?: Date;   // Hora programada
  eventStart?: Date;     // Inicio del evento
  eventEnd?: Date;       // Fin del evento

  sheduleId?: number;    // ID del horario

  eventTypeId: number;   // ID del tipo de evento
  eventTypeName: string; // Nombre del tipo de evento

  isPublic: boolean;     // Público o privado
  statusId: number;      // Estado del evento
  statusName: string;    // Nombre del estado
}
export interface EventType extends GenericModel {}

export interface AccessPointDto {
  id: number;
  name: string;
  description?: string;
  typeId: number;
  type?: string | null;
  eventId: number;
  eventName?: string | null;
  isDeleted: boolean;
}
