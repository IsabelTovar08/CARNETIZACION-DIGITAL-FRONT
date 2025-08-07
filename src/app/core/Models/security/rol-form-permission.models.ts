import { Permission } from "./permission.models";

export interface RolFormPermissionsCreate{
  rolId: number,
  formId: number,
  permissions: number[];
}
export interface RolFormPermissionsList{
  rolId: number,
  rolName: string,
  formId: number,
  formName: string,
  permissions: Permission[];
}
