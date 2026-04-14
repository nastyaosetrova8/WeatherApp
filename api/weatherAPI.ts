import axios from 'axios';
import { Coords } from '../util/interfaces';
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
