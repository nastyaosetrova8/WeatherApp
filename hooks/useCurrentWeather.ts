import { useCallback, useState } from 'react';
import { Coords, WeatherData } from '../util/interfaces';
import { getWeatherByCoords } from '../api/weatherAPI';

export const useCurrentWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentWeather = useCallback(
    async (coords: Coords, onDone?: () => void) => {
      setIsLoading(true);
      try {
        const data = await getWeatherByCoords(coords);
        setWeather(data);
        if (onDone) onDone();
      } catch (error: any) {
        console.error('Weather error:', error);

        console.error(error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  return { weather, isLoading, fetchCurrentWeather, setWeather };
};
