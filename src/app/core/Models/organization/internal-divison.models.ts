import { GenericModel } from "./generic.model";

export interface InternalDivisionList extends GenericModel {
  organizationalUnitId: number;
  organizationalUnitName: string;
  areaCategoryId: number;
  areaCategoryName: string;
}

export interface InternalDivisionCreate extends InternalDivisionList {
 
  organizationalUnitId: number;
  areaCategoryId: number;
}