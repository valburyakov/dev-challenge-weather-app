import { Component, Inject, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { WeatherService } from './services/weather.service';
import { CurrentWeather } from './models/cureent-weather.class';
import { windowToken } from './window.token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private weatherService: WeatherService,
              private snackBar: MatSnackBar,
              @Inject(windowToken) private window: Window) {}

  currentWeather?: CurrentWeather | null;
  geolocationError = '';
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    if ('geolocation' in this.window.navigator) {
      this.window.navigator.geolocation.getCurrentPosition(
        (position: Position) => this.getWeather(position),
        (err: PositionError) => this.handleGeolocationError(err)
      );
    } else {
      this.getWeather( 'Kharkiv');
    }
  }

  onCitySelected($event: string | number) {
    this.geolocationError = '';
    this.getWeather($event);
  }

  private getWeather(city: string | number | Position) {
    this.weatherService.getCurrentWeather(city).pipe(
      map(response => new CurrentWeather(response)),
      finalize(() => this.loading = false),
      catchError(err => {
        this.snackBar.open(err, 'Dismiss');
        return of(null);
      })
    ).
      subscribe(res => this.currentWeather = res);
  }

  private handleGeolocationError(error: PositionError) {
    this.loading = false;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.geolocationError = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.geolocationError = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        this.geolocationError = 'The request to get user location timed out.';
        break;
      default:
        this.geolocationError = 'An unknown error occurred.';
        break;
    }
  }

}
