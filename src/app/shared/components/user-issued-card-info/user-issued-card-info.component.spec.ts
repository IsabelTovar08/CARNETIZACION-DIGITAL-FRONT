import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIssuedCardInfoComponent } from './user-issued-card-info.component';

describe('UserIssuedCardInfoComponent', () => {
  let component: UserIssuedCardInfoComponent;
  let fixture: ComponentFixture<UserIssuedCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIssuedCardInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIssuedCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
