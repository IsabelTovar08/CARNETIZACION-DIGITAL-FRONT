import { GenericModel } from "./generic.model";

export interface Role extends GenericModel{

}

export interface RoleFormPermisionsRequest{
  RoleId: number;
  FormId: number;
  PermissionsIds: number[];
}
