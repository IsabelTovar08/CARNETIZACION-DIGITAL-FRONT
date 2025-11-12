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
}

export interface CreateEventRequest {
  event: {
    id?: number;
    name: string;
    code: string;
    description?: string;
    scheduleDate: string | null;
    scheduleTime?: string | null;
    scheduleId?: number | null;
    eventTypeId: number;
    ispublic: boolean;
    statusId: number;
    accessPoints?: number[];
    profileIds?: number[];
    organizationalUnitIds?: number[];
    internalDivisionIds?: number[];
  };
  accessPoints: AccessPointDto[];
  profileIds: number[];
  organizationalUnitIds: number[];
  internalDivisionIds: number[];
}

