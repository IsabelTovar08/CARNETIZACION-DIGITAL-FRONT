import { GenericModel } from "./generic.model";

export interface OrganizationalUnitList extends GenericModel{
}

export interface OrganizationalUnitCreate extends GenericModel{
}

export interface Branch {
  id: number;
  name: string;
  // Agregar otros campos si son necesarios
}

export interface OrganizationalUnitWithBranchesCreate {
  unit: {
    id: number;
    name: string;
    description: string;
  };
  branchIds: number[];
}

export interface AssignBranchDto {
  organizationalUnitId: number;
  branchId: number;
}

export interface RemoveBranchDto {
  organizationalUnitId: number;
  branchId: number;
}

export interface OrganizationalUnitDetail {
  id: number;
  name: string;
  description: string;
  code?: string;
  isDeleted: boolean;
  createAt: string;
  updateAt: string;
  branchesCount: number;
  divisionsCount: number;

  organizationalUnitBranches: OrganizationalUnitBranch[];
}

export interface OrganizationalUnitBranch {
  branchId: number;
  branch: Branch;
}
