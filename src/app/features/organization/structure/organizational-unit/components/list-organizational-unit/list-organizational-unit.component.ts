import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { GenericListCardComponent } from "../../../../../../shared/components/generic-list-card/generic-list-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../../core/Services/api/api.service';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';

import { OrganizationalUnitCreate, OrganizationalUnitList } from '../../../../../../core/Models/organization/organizationalUnit.models';

@Component({
  selector: 'app-list-organizational-unit',
  imports: [MatIconModule, MatMenuModule, GenericListCardComponent, MatButtonModule],
  templateUrl: './list-organizational-unit.component.html',
  styleUrl: './list-organizational-unit.component.css'
})
export class ListOrganizationalUnitComponent implements OnInit {
  // Igual que en Events: el dataSource que se pasa ya mapeado a card items
  listUnits: any[] = [];

  constructor(
    private apiService: ApiService<OrganizationalUnitCreate, OrganizationalUnitList>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.apiService.ObtenerTodo('OrganizationalUnit').subscribe((resp) => {
      const data = (resp?.data ?? []) as OrganizationalUnitList[];
      this.listUnits = data.map(this.toCardItem);
    });
  }

  private toCardItem = (e: OrganizationalUnitList): any => {
    const { id, name, description, isDeleted, ...rest } = e;
    
    const divisionsCount = e.divisionsCount ?? 0;
    const branchesCount = e.branchesCount ?? 0;

    return {
      ...rest,
      id,
      title: name ?? 'Unidad Organizativa',
      subtitle: `${divisionsCount} División${divisionsCount === 1 ? '' : 'es'}, ${branchesCount} Sucursal${branchesCount === 1 ? '' : 'es'}`,
      description: description ?? 'Sin descripción.',
      tags: ['Sin estado', 'General'],
      imageUrl: 'https://www.anahuac.mx/mexico/sites/default/files/styles/webp/public/noticias/Empresas-mas-innovadores-en-el-mundo.jpg.webp?itok=jy4fPHsa',
      isDeleted: !!isDeleted,
    };
  };

  create() { }
  
  view(e: any): void {
  // Opción absoluta (incluye 'dashboard' si es tu layout padre):
  this.router.navigate(['/dashboard/organizational/structure/unit', e.id, 'internal-division']);
  
  
}
  edit(e: any) { }
  remove(e: any) { }
  toggle(e: any) { }
}
