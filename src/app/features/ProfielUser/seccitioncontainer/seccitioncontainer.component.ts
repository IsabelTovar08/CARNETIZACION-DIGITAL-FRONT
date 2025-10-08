import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderSeccionComponent } from '../header-seccion/header-seccion.component';
import { TargetPersonComponent } from "../../security/people/components/target-person/target-person.component";
import { FormPErsonComponent } from "../../security/people/components/form-person/form-person.component";

@Component({
  selector: 'app-seccitioncontainer',
  imports: [CommonModule, RouterOutlet, HeaderSeccionComponent, TargetPersonComponent, FormPErsonComponent],
  templateUrl: './seccitioncontainer.component.html',
  styleUrl: './seccitioncontainer.component.css'
})
export class SeccitioncontainerComponent {
constructor() {

  }
}