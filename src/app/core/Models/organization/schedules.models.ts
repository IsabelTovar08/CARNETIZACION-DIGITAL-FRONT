import { GenericModel } from "./generic.model";

export interface ScheduleCreate {
    id?: number;
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    // organizationId: number;

}

export interface ScheduleList extends GenericModel {
    startTime: string;
    endTime: string;
    days?: string[];
    // organizationId: number;
    // organizationName?: string | null;
}