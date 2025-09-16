import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListFormsComponent } from './list-forms.component';

describe('ListFormsComponent', () => {
  let component: ListFormsComponent;
  let fixture: ComponentFixture<ListFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,      
        ListFormsComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
