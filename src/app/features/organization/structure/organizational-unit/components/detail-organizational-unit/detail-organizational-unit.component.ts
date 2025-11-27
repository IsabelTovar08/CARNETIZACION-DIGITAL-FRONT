import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrganizationalUnitService } from '../../../../../../core/Services/api/organizational/organization-unit/organization-unit.service';
import { BranchService } from '../../../../../../core/Services/api/organizational/branch/branch.service';
import { SnackbarService } from '../../../../../../core/Services/snackbar/snackbar.service';
import { OrganizationalUnitDetail, Branch, AssignBranchDto, RemoveBranchDto, OrganizationalUnitBranch } from '../../../../../../core/Models/organization/organizationalUnit.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-organizational-unit',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  templateUrl: './detail-organizational-unit.component.html',
  styleUrl: './detail-organizational-unit.component.css'
})
export class DetailOrganizationalUnitComponent implements OnInit {
  unitId: number;
  unitDetail: OrganizationalUnitDetail | null = null;

  allBranches: Branch[] = [];
  assignedBranches: Branch[] = [];
  availableBranches: Branch[] = [];

  assignForm: FormGroup;
  displayedColumns: string[] = ['name', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationalUnitService: OrganizationalUnitService,
    private branchService: BranchService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DetailOrganizationalUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { unitId: number }
  ) {
    this.unitId = data?.unitId || +this.route.snapshot.params['id'];

    this.assignForm = this.fb.group({
      branchId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUnitDetail();
    this.loadAllBranches();
    
  }

  private loadUnitDetail(): void {
    this.organizationalUnitService.getDetail(this.unitId).subscribe({
      next: (resp) => {
        this.unitDetail = resp?.data ?? null;

        console.log('Unit Detail:', this.unitDetail);

        // Extraer branches asignadas desde organizationalUnitBranches
        this.assignedBranches = this.unitDetail?.organizationalUnitBranches?.map(
            (link: OrganizationalUnitBranch) => link.branch
          ) ?? [];


        this.updateAvailableBranches();
      },
      error: (err) => {
        this.snackbarService.showError('Error al cargar detalle de la unidad');
        console.error(err);
      }
    });
  }

  private loadAllBranches(): void {
    this.branchService.ObtenerTodo('Branch').subscribe({
      next: (resp) => {
        this.allBranches = resp?.data ?? [];
        this.updateAvailableBranches();
      },
      error: (err) => {
        this.snackbarService.showError('Error al cargar sucursales');
        console.error(err);
      }
    });
  }

//   private loadUnitDetail(): void {
//   this.organizationalUnitService.getDetail(this.unitId).subscribe({
//     next: (resp) => {
//       this.unitDetail = resp?.data ?? null;
//       console.log('Unit Detail:', this.unitDetail);

//       // Extract assigned branches
//       this.assignedBranches = this.unitDetail?.organizationalUnitBranches?.map(
//         link => link.branch
//       ) ?? [];

//       // Update available branches
//       this.updateAvailableBranches();
//     },
//     error: (err) => {
//       this.snackbarService.showError('Error al cargar detalle de la unidad');
//       console.error(err);
//     }
//   });
// }

  private updateAvailableBranches(): void {
    if (!this.allBranches.length) return;

    const assignedIds = this.assignedBranches.map(b => b.id);

    this.availableBranches = this.allBranches.filter(
      b => !assignedIds.includes(b.id)
    );
  }
  assignBranch(): void {
    if (this.assignForm.invalid) return;

    const dto: AssignBranchDto = {
      organizationalUnitId: this.unitId,
      branchId: this.assignForm.value.branchId
    };

    this.organizationalUnitService.assignBranch(dto).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Sucursal asignada exitosamente');
        this.assignForm.reset();
        this.loadUnitDetail(); 
      },
      error: (err) => {
        this.snackbarService.showError(
          err.status === 500
            ? 'La sucursal ya está asignada'
            : 'Error al asignar sucursal'
        );
        console.error(err);
      }
    });
  }

  removeBranch(branchId: number): void {
    Swal.fire({
      title: '¿Remover sucursal?',
      text: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      const dto: RemoveBranchDto = {
        organizationalUnitId: this.unitId,
        branchId
      };

      this.organizationalUnitService.removeBranch(dto).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Sucursal removida');
          this.loadUnitDetail(); // 🔥 actualizar
        },
        error: (err) => {
          this.snackbarService.showError('Error al remover sucursal');
          console.error(err);
        }
      });
    });
  }

  goBack(): void {
    this.dialogRef.close();
  }
}