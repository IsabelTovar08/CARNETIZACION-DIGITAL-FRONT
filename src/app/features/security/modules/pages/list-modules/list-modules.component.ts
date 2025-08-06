import { LoangingServiceService } from './../../../../../core/Services/loanding/loanging-service.service';
import { Component, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../../shared/components/generic-table/generic-table.component";
import { ApiService } from '../../../../../core/Services/api/api.service';
import { Module } from '../../../../../core/Models/security/module.models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-list-modules',
  imports: [
    CommonModule,
    GenericTableComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './list-modules.component.html',
  styleUrl: './list-modules.component.css'
})
export class ListModulesComponent implements OnInit {
  listModule$!: Observable<Module[]>;

  constructor(
    private apiService: ApiService<Module, Module>,
    public loadingService: LoangingServiceService
  ) { }

  ngOnInit(): void {
     this.listModule$ = this.apiService.ObtenerTodo('Module')
  }

  displayedColumns: string[] = ['name', 'description', 'isDeleted', 'actions'];


  save() { }
  delete(item: any) { }
  toggleIsActive(item: any) { }
}
