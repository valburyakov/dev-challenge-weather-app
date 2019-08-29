import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';

import { LayoutComponent } from './layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { mockProvider, SpyObject } from '@netbasal/spectator';
import { CityListService } from '../services/city-list.service';
import { of } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
      ],
      providers: [
        mockProvider(CityListService)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    const service: SpyObject<CityListService> = TestBed.get(CityListService);
    service.getCitiesList.and.returnValue(of([
      {
        id: 707860,
        name: 'Hurzuf',
        country: 'UA',
        coord: {
          lon: 34.283333,
          lat: 44.549999
        }
      },
      {
        id: 519188,
        name: 'Novinki',
        country: 'RU',
        coord: {
          lon: 37.666668,
          lat: 55.683334
        }
      }
    ]));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
