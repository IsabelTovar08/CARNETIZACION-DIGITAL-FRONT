import { GenericModel } from "./generic.model";

export interface OrganizationalUnitList extends GenericModel{
    divisionsCount: number;
    branchesCount: number;
}

export interface OrganizationalUnitCreate extends GenericModel{
}
