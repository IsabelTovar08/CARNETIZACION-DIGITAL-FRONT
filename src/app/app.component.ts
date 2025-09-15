import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoangingServiceService } from './core/Services/loanding/loanging-service.service';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CARNETIZACION-DIGITAL-FRONT';
  loading = false;

  constructor(private loadingService: LoangingServiceService) {
    this.loadingService.loading$.subscribe(show => {
      setTimeout(() => {
        this.loading = show;
      });
    });

  }
}
