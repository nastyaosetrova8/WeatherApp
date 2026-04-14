export interface Coords {
  latitude: number;
  longitude: number;
}

export interface WeatherDescription {
  description: string;
}

export interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
  };
  weather: WeatherDescription[];
}

export interface IScreenProps {
  navigation?: any;
  route?: any;
}
