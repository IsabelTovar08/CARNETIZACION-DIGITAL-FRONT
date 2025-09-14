import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMenuStructureComponent } from './list-menu-structure.component';

describe('ListMenuStructureComponent', () => {
  let component: ListMenuStructureComponent;
  let fixture: ComponentFixture<ListMenuStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMenuStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMenuStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
