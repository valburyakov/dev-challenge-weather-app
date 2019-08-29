export interface CityModel {
  id: number;
  name: string;
  country: string;
  coord: Coord;
}

interface Coord {
  lon: number;
  lat: number;
}
