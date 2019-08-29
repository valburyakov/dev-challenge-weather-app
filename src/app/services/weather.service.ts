import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { WeatherApiResponse } from '../models/weather-api.model';
import { weatherApiKeyToken } from '../apiKey.token';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient, @Inject(weatherApiKeyToken) private apiKey: string) { }

  /**
   * Gets current weather data from https://openweathermap.org/current
   *
   * @param search can be string with city name or number with city id or geolocation position
   *
   * @return An `Observable` of response body `WeatherApiResponse`
   */
  getCurrentWeather(search: string | number | Position): Observable<WeatherApiResponse> {
    const queryStr = typeof search === 'string'
      ? `q=${search}`
      : typeof search === 'number'
        ? `id=${search}`
        : `lat=${search.coords.latitude}&lon=${search.coords.longitude}`;

    return this.http.get<WeatherApiResponse>(`${this.apiUrl}?${queryStr}&appId=${this.apiKey}`).pipe(
      catchError(err => throwError(err.error.message || 'Unknown Server Error'))
    );
  }
}
