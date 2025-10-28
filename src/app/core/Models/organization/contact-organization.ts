import { GenericModel } from "./generic.model";

export interface ContactOrganizationRequest {
  id?: number;
  companyName: string;
  message: string;
  companyEmail: string;
  advisorName: string;
  advisorLastName: string;
  email: string;
  phoneNumber: string;
  advisorRole: string;
  documentTypeId: number;
  documentNumber: string;
  address: string;
  cityId: number;
  bloodTypeId: number;
  person: {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    documentTypeId: number;
    documentNumber: string;
    bloodTypeId: number;
    phone: string;
    email: string;
    address: string;
    cityId: number;
  };
}