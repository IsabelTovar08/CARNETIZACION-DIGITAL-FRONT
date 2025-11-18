export interface AttendanceItem {
  personId: number;
  personFullName: string;
  timeOfEntry: string;
  timeOfExit: string | null;
  timeOfEntryStr: string;
  timeOfExitStr: string | null;
  accessPointEntryId: number;
  accessPointOfEntryName: string;
  accessPointExitId: number | null;
  accessPointOfExitName: string | null;
  eventAccessPointEntryId: number;
  eventAccessPointExitId: number | null;
  eventId: number;
  eventName: string;
  success: boolean;
  message: string | null;
  id: number;
  isDeleted: boolean;
  code: string | null;
}

export interface AttendanceResponse {
  items: AttendanceItem[];
  total: number;
  page: number;
  pageSize: number;
}