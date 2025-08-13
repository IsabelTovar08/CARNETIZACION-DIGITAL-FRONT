export interface UserCreate{
  userName?: string;
  password: string;
  personId: number;
}

export interface UserList extends UserCreate{
  id: number;
  emailPerson?: string;
  namePerson: string;
  roles: string[];
  isDeleted: boolean;
}
