import { GenericModel } from "./generic.model";

export interface OrganizationalUnit extends GenericModel{
    divisionsCount: number;
    branchesCount: number;
}