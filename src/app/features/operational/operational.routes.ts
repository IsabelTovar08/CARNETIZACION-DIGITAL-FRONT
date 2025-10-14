import { Component } from '@angular/core';
import { Routes } from "@angular/router";

import { ListEventTypesComponent } from "./EventTypes/list-event-types/list-event-types.component";
import { ListEventsComponent } from "./events/list-events/list-events.component";
import { ListAccessPointComponent } from "./access-point/list-access-point/list-access-point.component";
import { CreateEventComponent } from './events/create-event/create-event.component';
import { MassUploadPeopleComponent } from './mass-upload-people/mass-upload-people/mass-upload-people.component';
import { DetailsPeopleImportComponent } from './mass-upload-people/details-people-import/details-people-import.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const operationalRoutes: Routes = [
  { path: 'event-types', component: ListEventTypesComponent },
  { path: 'events', component: ListEventsComponent },
  { path: 'access-points', component: ListAccessPointComponent },
  {
    path: 'events',
    children: [
      { path: '', component: ListEventsComponent },
      { path: 'crear', component: CreateEventComponent }
    ]
  },
  { path: 'card-issuance', component: MassUploadPeopleComponent },
  { path: 'import-batches/:id/details', component: DetailsPeopleImportComponent },
  { path: 'attendance', component: AttendanceComponent }
];
