export interface PersonCreate {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  documentTypeId: number;
  identification: string;
  bloodTypeId?: number;
  phone?: string;
  email: string;
  address?: string;
  cityId: number;
}

export interface PersonList extends PersonCreate{
  DocumentTypeName?: string;
  BloodTypeName?: string;
  CityName?: string;
  isDeleted: boolean;
}
