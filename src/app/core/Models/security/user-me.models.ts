
export interface UserMeDto {
  id: number;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  phone?: string;
}