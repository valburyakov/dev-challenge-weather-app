import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { CityModel } from '../models/city.model';
import { CityListService } from '../services/city-list.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  @Output() citySelected = new EventEmitter();

  search = new FormControl('', [Validators.required]);
  filteredCities$: Observable<CityModel[]>;
  destroy$ = new Subject<void>();
  cities$ = this.citiesService.getCitiesList();
  optionsLoading$ = this.citiesService.loading$;

  constructor(private citiesService: CityListService) {
    this.filteredCities$ = this.search.valueChanges
      .pipe(
        debounceTime(350),
        switchMap(state => state && state.length > 2 ? this.cities$.pipe(
          map(cities => this._filterStates(cities, state) ),
        )  : of([])),
        takeUntil(this.destroy$)
      );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackFn(index: number, item: CityModel): number {
    return item.id;
  }

  displayFn(city?: CityModel): string | undefined {
    return city ? city.name : undefined;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.citySelected.emit(event.option.value.id);
  }

  private _filterStates(states: CityModel[], value: string): CityModel[] {
    const filterValue = value.toLowerCase();

    return states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  searchCity(): void {
    if (this.search.valid && typeof this.search.value === 'string') {
      this.citySelected.emit(this.search.value);
    }
  }
}
