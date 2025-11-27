import { Role } from "./role.models";

export interface UserCreate {
  userName?: string;
  password: string;
  personId: number;
}

export interface UserList extends UserCreate {
  id: number;
  emailPerson?: string;
  namePerson: string;
  roles: Role[];
  isDeleted: boolean;
}

export interface UserMe {
  id: number;
  email?: string;
  PhoneNumber: string;
  roles: Role[];
  photoUrl?: string;
  permissions: Role[];
  currentProfile: any;
  twoFactorEnabled: boolean | null;
}
export interface UserMeDto {
  id: number;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  phone?: string;
}