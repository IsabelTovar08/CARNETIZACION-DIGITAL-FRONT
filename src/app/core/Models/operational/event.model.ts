import { GenericModel } from "../security/generic.model";

export interface Event extends GenericModel {
   code: string;
  scheduleDate?: Date;
  scheduleTime?: Date;
  eventStart?: Date;
  eventEnd?: Date;
  sheduleId?: number;
  eventTypeId: number;
  eventTypeName: string;
  isPublic: boolean;
  statusId: number;
  statusName: string; // Nombre del estado
}
export interface EventType extends GenericModel {}

export interface SelectOption {
  id: number;
  name: string;
}

export interface AccessPointDto {
  id: number;
  name: string;
  description?: string;
  typeId: number;
  // isDeleted: boolean;
}

export interface CreateEventRequest {
  event: {
    id?: number;           // 0 o no enviado
    name: string;
    code: string;          // requerido por tu backend
    description?: string;
    scheduleDate?: Date | string;
    scheduleTime?: Date | string;
    sheduleId?: number;
    eventTypeId: number;
    isPublic?: boolean;    // el binder suele ser case-insensitive
    statusId: number;
    eventStart?: Date;
    eventEnd?: Date;
  };

  accessPoints: AccessPointDto[];
  profileIds: number[]; 
  organizationalUnitIds: number[];
  internalDivisionIds: number[];
}

