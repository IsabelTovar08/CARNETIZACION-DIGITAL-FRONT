import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationStateService } from '../../../core/Services/navigation-state/navigation-state.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  breadcrumbPath: string[] = [];
  moduleName: string = '';
  submoduleName: string = '';
  @Input() tipoUsuario: string = '';
  @Input() isMobile: boolean = false;
  @Output() toggleMenu: EventEmitter<void> = new EventEmitter<void>();
  @Input() titulo: string = '';
  @Input() sidebarOpened: boolean = false;

  constructor(private navState: NavigationStateService) { }
  ngOnInit(): void {
    this.navState.pathTitles$.subscribe(path => {
      this.breadcrumbPath = path;
    });
  }

  onToggleMenu() {
    this.toggleMenu.emit();
  }
}
