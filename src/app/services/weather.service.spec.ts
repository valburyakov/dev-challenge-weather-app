import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { weatherApiKeyToken } from '../apiKey.token';
import { WeatherApiResponse } from '../models/weather-api.model';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const weatherMock: WeatherApiResponse = {
      coord: {lon: 145.77, lat: -16.92},
      weather: [{id: 803, main: 'Clouds', description: 'broken clouds', icon: '04n'}],
      base: 'cmc stations',
      main: {temp: 293.25, pressure: 1019, humidity: 83, temp_min: 289.82, temp_max: 295.37},
      wind: {speed: 5.1, deg: 150},
      clouds: {all: 75},
      rain: {'3h': 3},
      dt: 1435658272,
      sys: {type: 1, id: 8166, message: 0.0166, country: 'AU', sunrise: 1435610796, sunset: 1435650870},
      id: 2172797,
      name: 'Cairns',
      cod: 200
    };

  const testApiKey = 'test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        { provide: weatherApiKeyToken, useValue: testApiKey }
      ]
    });

    service = TestBed.get(WeatherService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current weather api response', () => {
    const searchStr = 'London';

    service.getCurrentWeather(searchStr).subscribe(result =>
      expect(result).toEqual(weatherMock)
    );

    httpMock.expectOne({
      method: 'GET'
    }).flush(weatherMock);

  });

  it('should get weather by city id', () => {
    const searchStr = 'London';

    service.getCurrentWeather(searchStr).subscribe();

    httpMock.expectOne({
      url: `${service.apiUrl}?q=${searchStr}&appId=${testApiKey}`
    });
  });

  it('should get weather by search string', () => {
    const id = 123;

    service.getCurrentWeather(id).subscribe();

    httpMock.expectOne({
      url: `${service.apiUrl}?id=${id}&appId=${testApiKey}`
    });
  });

  it('should get weather by geographic position', () => {
    const location = {coords : {latitude: 50, longitude: 55}} as Position;

    service.getCurrentWeather(location).subscribe();

    httpMock.expectOne({
      url: `${service.apiUrl}?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appId=${testApiKey}`
    });
  });

  it('should handle error and throw error message', () => {
    service.getCurrentWeather('123').subscribe(() => {},
      err => expect(err).toEqual('City not found')
    );

    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    httpMock.expectOne({
      method: 'GET'
    }).flush({message: 'City not found'}, mockErrorResponse);

  });

});
