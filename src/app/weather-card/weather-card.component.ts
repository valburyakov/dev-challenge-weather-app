import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CurrentWeather } from '../models/cureent-weather.class';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherCardComponent implements OnInit {

  @Input() currentWeather?: CurrentWeather;

  constructor() { }

  ngOnInit() {
  }

}
