import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderSeccionComponent } from '../header-seccion/header-seccion.component';
import { TargetPersonComponent } from "../../security/people/components/target-person/target-person.component";

@Component({
  selector: 'app-seccitioncontainer',
  imports: [CommonModule, RouterOutlet, HeaderSeccionComponent, TargetPersonComponent],
  templateUrl: './seccitioncontainer.component.html',
  styleUrl: './seccitioncontainer.component.css'
})
export class SeccitioncontainerComponent {
constructor() {

  }
}