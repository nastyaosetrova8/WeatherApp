import { useState, useCallback } from 'react';
import { Coords } from '../util/interfaces';
import { getWeeklyWeather } from '../api/weatherAPI';

export const useWeeklyWeather = () => {
  const [forecast, setForecast] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterForecast = (list: any[]) => {
    return list.filter((item: any) => item.dt_txt.includes('12:00:00'));
  };

  const fetchWeeklyWeather = useCallback(async (coords: Coords) => {
    setIsLoading(true);
    try {
      const data = await getWeeklyWeather(coords);
      //   if (data?.list) {
      //     const dailyData = data.list.filter((item: any) =>
      //       item.dt_txt.includes('12:00:00'),
      //     );
      //     setForecast(dailyData);
      //   }
      if (data && data.list) {
        const dailyData = filterForecast(data.list);
        setForecast(dailyData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { forecast, isLoading, setForecast, fetchWeeklyWeather };
};
