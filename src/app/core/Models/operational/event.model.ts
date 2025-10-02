import { GenericModel } from "../security/generic.model";

// Modelo principal de Event
export interface Event extends GenericModel {
  code: string;
  // description?: string;
  scheduleDate: Date | string;
  scheduleTime: Date | string;
  sheduleId?: number;
  eventTypeId: number;
  eventTypeName?: string;
  Ispublic: boolean;  
  statusId: number;
  statusName?: string;
  days?: string[];
}

// EventType (si lo necesitas)
export interface EventType extends GenericModel {
  // description?: string;
}

// Para los selects (Profiles, Units, Divisions)
export interface SelectOption {
  id: number;
  name: string;
}

// AccessPoint DTO
export interface AccessPointDto {
  id: number;
  name: string;
  description?: string;
  typeId: number;
}

// Request para crear evento
export interface CreateEventRequest {
  event: {
    id?: number;
    name: string;
    code: string;
    description?: string;
    scheduleDate: string | null;   
    scheduleTime: string | null;   
    scheduleId?: number | null;    
    eventTypeId: number;
    Ispublic: boolean;
    statusId: number;
    days?: string[];            
  };
  accessPoints: AccessPointDto[];
  profileIds: number[];
  organizationalUnitIds: number[];
  internalDivisionIds: number[];
}