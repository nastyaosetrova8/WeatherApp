import axios from 'axios';
import {
  Coords,
  // GeocodingItem,
  // WeatherData,
  // WeeklyWeatherData,
} from '../util/interfaces';
import { WEATHER_API_KEY } from '@env';

const API_KEY = WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'en',
  },
});

export const getWeatherByCoords = async (
  coords: Coords,
  signal?: AbortSignal,
) => {
  const { data } = await api.get('/data/2.5/weather', {
    params: { lat: coords.latitude, lon: coords.longitude },
    signal,
  });

  return data;
};

export const getWeeklyWeather = async (
  coords: Coords,
  signal?: AbortSignal,
) => {
  const { data } = await api.get('/data/2.5/forecast', {
    params: {
      lat: coords.latitude,
      lon: coords.longitude,
    },
    signal,
  });
  return data;
};

export const getCoordsByCity = async (city: string, signal?: AbortSignal) => {
  // const normalizedCity = city.trim();

  // if (!normalizedCity) {
  //   return null;
  // }

  const { data } = await api.get('/geo/1.0/direct', {
    params: { q: city, limit: 1 },
    signal,
  });

  // if (!data.length) {
  //   return null;
  // }

  return data[0] ?? null;

  // return {
  //   latitude: data[0].lat,
  //   longitude: data[0].lon,
  // };

  // --------------------------

  // const item = data[0];

  // return {
  //   coords: {
  //     latitude: item.lat,
  //     longitude: item.lon,
  //   },
  //   city: item.name,
  //   country: item.country,
  // };
};
