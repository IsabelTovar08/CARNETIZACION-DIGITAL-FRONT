import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ConfigFormComponent } from './config-form.component';

describe('ConfigFormComponent', () => {
  let component: ConfigFormComponent;
  let fixture: ComponentFixture<ConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigFormComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
