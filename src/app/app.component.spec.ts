import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatFormFieldModule, MatProgressSpinnerModule, MatSnackBarModule } from '@angular/material';
import { WeatherService } from './services/weather.service';
import { mockProvider, SpyObject } from '@netbasal/spectator';
import { MockComponent } from 'ng-mocks';
import { WeatherCardComponent } from './weather-card/weather-card.component';
import { LayoutComponent } from './layout/layout.component';
import { WeatherApiResponse } from './models/weather-api.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { windowToken } from './window.token';
import { CurrentWeather } from './models/cureent-weather.class';

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

const navigatorMock = {
  geolocation: {
    getCurrentPosition: jasmine.createSpy('location spy').and.callFake((onSuccess: PositionCallback) =>

      onSuccess({coords : {latitude: 50, longitude: 55}} as Position)
    )
  }
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, MatFormFieldModule, MatProgressSpinnerModule],
      declarations: [
        AppComponent,
        MockComponent(WeatherCardComponent),
        MockComponent(LayoutComponent)
      ],
      providers: [
        mockProvider(WeatherService),
        { provide: windowToken, useValue: { navigator: navigatorMock } }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const mockService: SpyObject<WeatherService> = TestBed.get(WeatherService);
    mockService.getCurrentWeather.and.returnValue(of(weatherMock));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    expect(app).toBeTruthy();

    const weatherInstance = fixture.debugElement.query(By.directive(WeatherCardComponent))
      .componentInstance as WeatherCardComponent;

    expect(weatherInstance.currentWeather).toEqual(new CurrentWeather(weatherMock));
  });

});
