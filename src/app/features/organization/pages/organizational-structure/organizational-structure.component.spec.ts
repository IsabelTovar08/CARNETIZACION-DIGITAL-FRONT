import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EstructuraOrganizativaComponent } from './organizational-structure.component';

describe('EstructuraOrganizativaComponent', () => {
  let component: EstructuraOrganizativaComponent;
  let fixture: ComponentFixture<EstructuraOrganizativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,          // 👉 simula ActivatedRoute/Router
        EstructuraOrganizativaComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstructuraOrganizativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
