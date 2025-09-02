import { GenericModel } from "./generic.model";

export interface ScheduleCreate extends GenericModel {
    startTime: string;
    endTime: string;
    // organizationId: number;

}

export interface ScheduleList extends GenericModel {
    startTime: string;
    endTime: string;
    // organizationId: number;
    // organizationName?: string | null;
}