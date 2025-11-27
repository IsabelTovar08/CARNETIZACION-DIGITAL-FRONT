import { GenericModel } from "../security/generic.model";

export interface Event extends GenericModel {
  code: string;
  scheduleDate: Date | string;
  endDate?: Date | string;
  scheduleId?: number;          
  eventTypeId: number;
  eventTypeName?: string;
  isPublic: boolean;            
  statusId: number;
  statusName?: string;
  days?: string[];
}

export interface EventType extends GenericModel {
  // description?: string;
}

export interface SelectOption {
  id: number;
  name: string;
}

export interface AccessPointDto {
  id: number;
  name: string;
  description?: string;
  typeId: number;
  type?: string;
  qrCodeKey?: string;
  code?: string;
  isDeleted?: boolean;
  eventId?: number;
  eventName?: string;
}

export interface CreateEventRequest {
  event: {
    name: string;
    code: string;
    description?: string;
    eventStart: string | null;
    eventEnd: string | null;
    scheduleId?: number | null;
    eventTypeId: number;
    ispublic: boolean;
    statusId: number;
  };
  scheduleIds: number[];
  accessPoints: {
    name: string;
    description?: string;
    typeId: number;
  }[];
  profileIds: number[];
  organizationalUnitIds: number[];
  internalDivisionIds: number[];
  supervisorUserIds?: number[];
}

export interface EventDtoRequest {
  id: number;
  name: string;
  code: string;
  description?: string;
  eventStart: string | null;
  eventEnd: string | null;
  scheduleId?: number | null;
  scheduleIds?: number[];
  eventTypeId: number;
  eventName?: string;
  ispublic: boolean;
  statusId: number;
  accessPoints?: number[];
  profileIds?: number[];
  organizationalUnitIds?: number[];
  internalDivisionIds?: number[];
  supervisorUserIds?: number[];
}

export interface FinalizeEventResponse {
  success: boolean;
  message: string;
  supervisors: {
    eventId: number;
    eventName: string;
    userId: number;
    fullName: string;
    userEmail: string;
  }[];
}

