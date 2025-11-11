import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router'; // 👈 Importar ActivatedRoute
import { of } from 'rxjs';

import { CardPersonListComponent } from './card-person-list.component';

describe('CardPersonListComponent', () => {
  let component: CardPersonListComponent;
  let fixture: ComponentFixture<CardPersonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardPersonListComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            },
            queryParams: of({}),
            params: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
