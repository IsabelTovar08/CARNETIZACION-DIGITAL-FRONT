// access-point.model.ts

import { GenericModel } from "../security/generic.model";

 // Ajusta la ruta según tu estructura

// Para crear/actualizar AccessPoints
export interface AccessPointCreate {
  id?: number;
  name?: string;
  description?: string | null;
  eventId: number;
  typeId: number;
}

// Para listar/mostrar AccessPoints
export interface AccessPointList {
  id: number;
  name: string;
  description?: string | null;
  eventId: number;
  eventName?: string | null;
  typeId: number;
  type?: string | null;
  qrCodeKey?: string | null;
  code?: string | null;
  isDeleted?: boolean;
}

// DTO simplificado para enviar al crear evento
export interface AccessPointDto {
  id: number;
  name: string;
  description?: string | null;
  typeId: number;
}