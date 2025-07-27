import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MenuItem } from '../../../core/Models/MenuItemModel';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  @Input() menuItems: MenuItem[] = []
  @Output() itemSelected = new EventEmitter<{ module: string; submodule?: string }>();

  activeItem: string = 'dashboard';
  expandedItems: Set<string> = new Set();
  isMobile: boolean = false;

  constructor
    (
      private router: Router,
    ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItems'] && this.menuItems.length > 0) {
      this.setActiveItemFromRoute();
      this.initializeExpandedItems();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private initializeExpandedItems(): void {
    // Expandir automáticamente los items que contienen el item activo
    this.menuItems.forEach(group => {
      if (group.children) {
        group.children.forEach(item => {
          if (item.type === 'collapse' && item.children) {
            const hasActiveChild = item.children.some(child => child.id === this.activeItem);
            if (hasActiveChild) {
              this.expandedItems.add(item.id);
            }
          }
        });
      }
    });
  }

  selectItem(item: MenuItem): void {
    this.activeItem = item.id;

    const selected = this.getItemPath(item);
    this.itemSelected.emit(selected);

    // Aquí puedes agregar la lógica de navegación
    if (item.url) {
      this.router.navigate([`${item.url}`]);
      console.log('Navigating to:', item.url);
    }

    // Emitir evento si es necesario
    this.onItemSelected(item);
  }

  toggleCollapse(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  private onItemSelected(item: MenuItem): void {
    // Aquí puedes emitir un evento o ejecutar lógica adicional
    console.log('Item selected:', item);

    // Ejemplo de emit si necesitas comunicarte con el componente padre
    // this.itemSelected.emit(item);
  }

  // Método para actualizar el menu dinámicamente si es necesario
  updateMenuItems(newMenuItems: MenuItem[]): void {
    this.menuItems = newMenuItems;
    this.initializeExpandedItems();
  }

  // Método para establecer el item activo desde fuera del componente
  setActiveItem(itemId: string): void {
    this.activeItem = itemId;
    this.initializeExpandedItems();
  }

  // Encuentra el módulo padre del ítem seleccionado
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
      submodule: submoduleTitle !== moduleTitle ? submoduleTitle : undefined
    };
  }

  private setActiveItemFromRoute(): void {
    const currentUrl = this.router.url;

    for (const group of this.menuItems) {
      for (const item of group.children || []) {

        if (item.type === 'item' && item.url && currentUrl == item.url) {
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
