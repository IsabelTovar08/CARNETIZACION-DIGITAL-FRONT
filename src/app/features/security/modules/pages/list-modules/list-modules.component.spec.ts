import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListModulesComponent } from './list-modules.component';

describe('ListModulesComponent', () => {
  let component: ListModulesComponent;
  let fixture: ComponentFixture<ListModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   
        RouterTestingModule,       
        ListModulesComponent      
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
