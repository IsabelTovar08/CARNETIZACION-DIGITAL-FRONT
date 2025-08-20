import { Routes } from "@angular/router";
import { ListEventTypesComponent } from "./EventTypes/list-event-types/list-event-types.component";
import { ListEventsComponent } from "./events/list-events/list-events.component";
import { ListAccessPointComponent } from "./access-point/list-access-point/list-access-point.component";

export const operationalRoutes: Routes = [
  { path: 'event-types', component: ListEventTypesComponent },
  { path: 'events', component: ListEventsComponent },
  { path: 'access-points', component: ListAccessPointComponent }


];
