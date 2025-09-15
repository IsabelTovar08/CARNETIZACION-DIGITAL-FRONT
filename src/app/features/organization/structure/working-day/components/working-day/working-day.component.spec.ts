import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';  // 👉 mock de ActivatedRoute

import { JornadasComponent } from './working-day.component';

describe('JornadasComponent', () => {
  let component: JornadasComponent;
  let fixture: ComponentFixture<JornadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  
        RouterTestingModule,      
        JornadasComponent         
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JornadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
