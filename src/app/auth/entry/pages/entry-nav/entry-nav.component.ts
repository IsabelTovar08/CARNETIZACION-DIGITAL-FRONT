import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthNavbarComponent } from '../auth-navbar/auth-navbar.component.component'; // ajusta ruta si es necesario

@Component({
  selector: 'app-entry-nav',
  imports: [CommonModule, RouterModule, AuthNavbarComponent],
  templateUrl: './entry-nav.component.html',
  styleUrl: './entry-nav.component.css'
})
export class EntryNavComponent {

}
