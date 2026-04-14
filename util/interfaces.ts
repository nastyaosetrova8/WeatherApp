// import { StackNavigationProp } from '@react-navigation/stack';

import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface Coords {
  latitude: number;
  longitude: number;
}

// export interface IMarker {
//   id: String;
//   coordinate: Coords;
//   title: String;
//   description: String;
// }

// export interface IIcon {
//   icon: string;
// }

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

export interface WeekDayWeatherData {
  main: {
    temp: number;
  };
  dt_txt: string;
}

export interface WeeklyWeatherData {
  list: WeekDayWeatherData[];
  city: {
    name: string;
    country: string;
  };
}

// ПЕРЕДИВИТИСЯ ===================
export interface GeocodingItem {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  // local_names?: Record<string, string>;
}
// ====================================

export type RootStackParamList = {
  Map: undefined;
  Weather: { coords: { latitude: number; longitude: number } };
};

export interface IScreenProps {
  navigation?: any;
  route?: any;
}

// export type MapScreenProps = StackNavigationProp<RootStackParamList, 'Map'>;

export interface BaseButtonProps {
  children: ReactNode;
  mode: 'flat' | 'contained';
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}
