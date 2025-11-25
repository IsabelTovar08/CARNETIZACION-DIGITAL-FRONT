
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
  data: any[];
  total: number;
  page: number;
  pageSize: number;
}