import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // 👉 Mock para ActivatedRoute y Router

import { ListAccessPointComponent } from './list-access-point.component';

describe('ListAccessPointComponent', () => {
  let component: ListAccessPointComponent;
  let fixture: ComponentFixture<ListAccessPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,   
        RouterTestingModule,       
        ListAccessPointComponent   
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAccessPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
