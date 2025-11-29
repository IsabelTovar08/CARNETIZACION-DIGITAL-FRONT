
export interface PersonSearchFilters {
  search?: string;
  internalDivisionId?: number;
  organizationalUnitId?: number;
  profileId?: number;
  page?: number;
  pageSize?: number;
}

export interface PersonSearchResponse {
  success: boolean;
  message: string;
  data: PersonDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PersonDto {
  id: number;
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  userId?: number;
}