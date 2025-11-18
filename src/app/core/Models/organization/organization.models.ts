import { GenericModel } from "./generic.model";
import { UserList } from "../security/user.models";
import { CustomTypeList } from "../parameter/custom-type.models";

export interface Branch extends GenericModel {
}

export interface Organization {
    id: number;
    name: string;
    description?: string;
    isDeleted: boolean;
    code?: string;
    logo?: string;
    typeId: number;
    typeName?: string;
    organizationType?: CustomTypeList;
    users: UserList[];
    branches: Branch[];
}

export interface OrganizationUpdate {
    id: number;
    name: string;
    description: string;
    logo: string;
    typeId: number;
}