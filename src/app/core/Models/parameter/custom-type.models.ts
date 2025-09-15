import { GenericModel } from "../security/generic.model";

export interface CustomTypeSpecific extends GenericModel {
}

export interface CustomTypeCreate extends GenericModel {
  typeCategoryId: number;
}

export interface CustomTypeList extends CustomTypeCreate {
  typeCategoryName: string;
}

export interface TypeCategory{
  id: number;
  name: string;
  isDeleted: boolean;
  types?: CustomTypeList[];
}
