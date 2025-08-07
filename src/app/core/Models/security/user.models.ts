export interface UserCreate{
  id: number;
  userName?: string;
  email?: string;
  password: string;
  personId: number;
}

export interface UserList extends UserCreate{
  namePerson: string;
  roles: string[];
  isDeleted: boolean;
}
