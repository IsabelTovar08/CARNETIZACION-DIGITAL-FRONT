import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../../core/Models/MenuItemModel';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuCreateService } from '../../../core/Services/shared/menu-create.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // ✅ Arreglo normal para tu lógica interna
  menuItems: MenuItem[] = [];

  loading = true;
  @Output() itemSelected = new EventEmitter<{ module: string; submodule?: string }>();

  activeItem: string = 'dashboard';
  expandedItems: Set<string> = new Set();
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private menu: MenuCreateService,
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadMenuItems();
  }

  // # Cargar menú desde el servicio, guardar en el arreglo normal
 private loadMenuItems(): void {
    this.menu.getMenu().subscribe({
      next: (items) => {
        this.menuItems = items ?? [];
        this.loading = false;
        this.setActiveItemFromRoute();
        this.initializeExpandedItems();
      },
      error: () => {
        this.menuItems = [];
        this.loading = false;
      }
    });
  }


  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private initializeExpandedItems(): void {
    // # Expande automáticamente las ramas que contienen el item activo
    this.menuItems.forEach(group => {
      group.children?.forEach(item => {
        if (item.type === 'collapse' && item.children) {
          const hasActiveChild = item.children.some(child => child.id === this.activeItem);
          if (hasActiveChild) this.expandedItems.add(item.id);
        }
      });
    });
  }

  selectItem(item: MenuItem): void {
    this.activeItem = item.id;

    const selected = this.getItemPath(item);
    this.itemSelected.emit(selected);

    if (item.url) {
      this.router.navigate([item.url]);
      console.log('Navigating to:', item.url);
    }

    this.onItemSelected(item);
  }

  toggleCollapse(itemId: string): void {
    if (this.expandedItems.has(itemId)) this.expandedItems.delete(itemId);
    else this.expandedItems.add(itemId);
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  private onItemSelected(item: MenuItem): void {
    // # Lógica adicional cuando seleccionas un item
    console.log('Item selected:', item);
  }

  // # Si desde fuera te envían un nuevo menú
  updateMenuItems(newMenuItems: MenuItem[]): void {
    this.menuItems = newMenuItems;   // ✅ era incorrecto asignar al Observable
    this.initializeExpandedItems();
  }

  // # Establecer activo desde afuera si hace falta
  setActiveItem(itemId: string): void {
    this.activeItem = itemId;
    this.initializeExpandedItems();
  }

  // # Encuentra el path (módulo/submódulo) del item seleccionado
  private getItemPath(item: MenuItem): { module: string; submodule?: string } {
    let moduleTitle = '';
    let submoduleTitle = '';

    this.menuItems.forEach(group => {
      group.children?.forEach(child => {
        if (child.id === item.id) {
          moduleTitle = group.title;
          submoduleTitle = item.title;
        }
        if (child.type === 'collapse') {
          child.children?.forEach(sub => {
            if (sub.id === item.id) {
              moduleTitle = child.title;
              submoduleTitle = sub.title;
            }
          });
        }
      });
    });

    return {
      module: moduleTitle || item.title,
      submodule: submoduleTitle && submoduleTitle !== moduleTitle ? submoduleTitle : undefined
    };
  }

  private setActiveItemFromRoute(): void {
    const currentUrl = this.router.url;

    for (const group of this.menuItems) {
      for (const item of group.children || []) {
        if (item.type === 'item' && item.url && currentUrl === item.url) {
          this.activeItem = item.id;
          return;
        }
        if (item.type === 'collapse') {
          for (const subItem of item.children || []) {
            if (subItem.url && currentUrl.includes(subItem.url)) {
              this.activeItem = subItem.id;
              return;
            }
          }
        }
      }
    }
  }
}
