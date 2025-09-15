export interface UserRolCreateAll{
  userId: number;
  rolesId: number[];
}
export interface UserRolCreate{
  userId: number;
  rolId: number;
}
export interface UserRolList extends UserRolCreate{
  userName: number;
  rolName: string;
}
