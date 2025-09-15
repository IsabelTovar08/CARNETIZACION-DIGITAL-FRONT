import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListPermissionsComponent } from './list-permissions.component';

describe('ListPermissionsComponent', () => {
  let component: ListPermissionsComponent;
  let fixture: ComponentFixture<ListPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  
        RouterTestingModule,       
        ListPermissionsComponent   
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
