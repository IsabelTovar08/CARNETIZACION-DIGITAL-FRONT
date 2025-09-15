import { GenericModel } from "./generic.model";

export interface FromModel extends GenericModel{
  url: string;
  moduleId: number;
  icon: string;
}
