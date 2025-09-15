import { UserCreate } from "./user.models";

export interface PersonCreate {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  documentTypeId: number;
  documentNumber: string;
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

export interface PersonRegistrer {
  person: PersonCreate;
  user: UserCreate;
}
