import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Router, RouterModule } from "@angular/router";
import { PersonCreate, PersonList } from '../../../../../core/Models/security/person.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TargetPersonComponent } from '../target-person/target-person.component';
import { DataService } from '../../../../../core/Services/shared/data.service';
import { SnackbarService } from '../../../../../core/Services/snackbar/snackbar.service';

@Component({
  selector: 'app-list-person',
  imports: [
    CommonModule,
    GenericTableComponent, RouterModule],
  templateUrl: './list-person.component.html',
  styleUrl: './list-person.component.css'
})
export class ListPersonComponent implements OnInit {
  listPerson!: PersonList[];

  constructor(private apiService: ApiService<PersonCreate, PersonList>,
    private router: Router,
    private dialog : MatDialog,
    private dataService: DataService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getData()
  }
  getData(){
    this.dataService.personas$.subscribe(data => this.listPerson = data);
    this.dataService.getPeople();
  }

  displayedColumns: string[] = ['firstName', 'documentNumber', 'documentTypeName', 'bloodTypeName', 'cityName', 'isDeleted', 'actions'];


  save() { }
  edit(item: PersonList) {
   const dialogRef = this.dialog.open(TargetPersonComponent, {
         disableClose: true,
         width: '800px',
         maxHeight: '80vh',
         data: {
           title: item ? 'Editar' : 'Crear',
           item
         }
       });
  }
  delete(item: any) {

  }
  toggleIsActive(item: any) {
    this.apiService.deleteLogic('Person', item.id).subscribe(() => {
      this.snackbarService.showSuccess("Estado actualizado con éxito");
    })
   }
}
