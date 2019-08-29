import { WeatherApiResponse } from './weather-api.model';

export class CurrentWeather {
  country: string;
  city: string;
  iconUrl: string;
  date: number;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  description: string;

  constructor(response: WeatherApiResponse) {
    this.city = response.name;
    this.country = response.sys.country;
    this.iconUrl = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    this.date = response.dt * 1000;
    this.temperature = response.main.temp - 273.15;
    this.humidity = response.main.humidity;
    this.pressure = response.main.pressure;
    this.description = response.weather[0].description;
    this.windSpeed = response.wind.speed;
    this.windDirection = this.degToCompass(response.wind.deg);
  }

  private degToCompass(num: number) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
  }
}
