// notification-dto.ts
/**
 * Representa una notificación almacenada en BD.
 */
export interface NotificationDto {
  id: number;                // Id de la notificación
  title: string;             // Título
  message: string;           // Mensaje
  notificationTypeId: number;// Tipo (id)
  notificationTypeName: string; // Nombre del tipo
  creationDate: string;      // Fecha de creación
  sendDate: string;         // Fecha en que fue enviada
  readDate?: string;       // Fecha de lectura (si aplica)
  redirectUrl?: string;   // URL de redirección (si aplica)
  notificationReceivedId?: number; // Id del registro de recepción
}
// notification-received-dto.ts
/**
 * Relación de la notificación con el usuario que la recibe.
 */
export interface NotificationReceivedDto {
  id: number;               // Id del registro de recepción
  notificationId: number;   // Id de la notificación
  userId: number;           // Id del usuario receptor
  statusId: number;         // Estado (Pending, Seen, etc.)
  sendDate: string;         // Fecha en que fue enviada
  readDate?: string;        // Fecha de lectura (si aplica)
}

/**
 * Estados posibles de una notificación.
 */
export enum NotificationStatus {
  Pending = 1,   // Pendiente
  Sent = 2,      // Enviada
  Read = 3,      // Leída
  Archived = 4   // Archivada
}


//* DTO para crear y enviar una notificación.
export interface ModificationRequestDtoRequest {
  userId: number;
  field: number;       // enum en backend (ModificationField)
  oldValue: string;
  newValue: string;
}

export interface ModificationRequestDtoResponse {
  id: number;
  userId: number;
  requestDate: string;
  fieldId: number;
  fieldName: string;
  oldValue: string;
  newValue: string;
  status: string;
}
