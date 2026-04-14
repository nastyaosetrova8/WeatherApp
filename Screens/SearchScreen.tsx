import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';

import { Coords, IScreenProps } from '../util/interfaces';
import { useWeeklyWeather } from '../hooks/useWeeklyWeather';
import WeatherCard from '../components/WeatherCard';

const SearchScreen: React.FC<IScreenProps> = ({ route }) => {
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  //   const [forecast, setForecast] = useState<any[]>([]);
  //   const [isLoading, setIsLoading] = useState(false);
  const { forecast, isLoading, setForecast, fetchWeeklyWeather } =
    useWeeklyWeather();

  console.log('PARAMS:', route.params);

  //   const filterForecast = (list: any[]) => {
  //     return list.filter((item: any) => item.dt_txt.includes('12:00:00'));
  //   };
  //   const fetchWeeklyWeather = async (coords: Coords) => {
  //     setIsLoading(true);
  //     try {
  //       const data = await getWeeklyWeather(
  //         coords,
  //         // route.params.coords || route.params.city,
  //       );
  //       if (data && data.list) {
  //         const dailyData = filterForecast(data.list);
  //         setForecast(dailyData);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const googleInputRef = useRef<GooglePlacesAutocompleteRef>(null);

  const handleSearchPress = () => {
    if (selectedCoords) {
      fetchWeeklyWeather(selectedCoords);
    } else {
      Alert.alert('Please enter a city');
    }
  };

  useFocusEffect(
    useCallback(() => {
      // if (!route.params?.coords) {
      return () => {
        setForecast([]);
        setSelectedCoords(null);
        googleInputRef.current?.setAddressText('');
      };
      // }
    }, [setForecast]),
  );

  useEffect(() => {
    if (route.params?.coords && route.params?.city) {
      // const coordsFromMap = route.params.coords;
      // const cityName = route.params.city;
      const { coords, city } = route.params;

      if (city && coords) {
        console.log('✅ Setting city to input:', city);

        setSelectedCoords(coords);
        fetchWeeklyWeather(coords);

        const timer = setTimeout(() => {
          if (googleInputRef.current) {
            googleInputRef.current?.setAddressText(city);
          }
        }, 400);

        // navigation.setParams({ coords: undefined, city: undefined });
        return () => clearTimeout(timer);
      }
    }
  }, [
    fetchWeeklyWeather,
    route.params,
    route.params?.city,
    route.params?.coords,
  ]);

  useEffect(() => {
    if (route.params?.reset) {
      setForecast([]);
      setSelectedCoords(null);
      googleInputRef.current?.setAddressText('');
    }
  }, [route.params?.reset, setForecast]);

  //   useEffect(() => {
  //     if ({city}) {
  //       setSearchQuery(city);
  //       handleSearch(city);
  //       fetchWeeklyForecast(city);
  //     }
  //   }, [city]);

  // -----------------------------

  //   const filterWeeklyForecast = (list: any[]) => {
  //     return list.filter((reading: any) => reading.dt_txt.includes('12:00:00'));
  //   };

  //   const data = await getWeeklyWeather(coords);
  //   const dailyData = filterWeeklyForecast(data.list);
  //   setWeeklyForecast(dailyData);

  //   // ======
  //   const getDayName = (timestamp: number) => {
  //     const date = new Date(timestamp * 1000);
  //     return date.toLocaleDateString('en-US', { weekday: 'long' });
  //   };

  //   // У FlatList renderItem:
  //   <View style={styles.row}>
  //     <Text style={styles.dayText}>{getDayName(item.dt)}</Text>
  //     <Text style={styles.tempText}>{Math.round(item.main.temp)}°C</Text>
  //   </View>;

  // -----------------------------

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* <View style={styles.searchSection}> */}
        <GooglePlacesAutocomplete
          // style={styles.input}
          ref={googleInputRef}
          placeholder="Type city name..."
          // value={searchQuery}
          // onChangeText={setSearchQuery}
          fetchDetails={true}
          onPress={(data, details = null) => {
            //   const city = data.description;
            //   const coords = {
            //     latitude: details?.geometry.location.lat,
            //     longitude: details?.geometry.location.lng,
            //   };
            //   setCity(city);
            //   fetchWeeklyWeather(coords);
            if (details) {
              setSelectedCoords({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            }
          }}
          textInputProps={{
            onChangeText: text => {
              if (text.length === 0) {
                setForecast([]);
                setSelectedCoords(null);
              }
            },
          }}
          query={{
            key: Config.GOOGLE_MAPS_API_KEY,
            language: 'en',
            types: '(cities)',
          }}
          styles={{
            textInput: styles.input,
            // container: { flex: 1 },
            listView: styles.list,
          }}
          onFail={error => console.log('Google Error:', error)}
        />

        {/* <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
            // onPress={() => selectedCoords && fetchWeeklyWeather(selectedCoords)}
          >
            <Text>🔍</Text>
          </TouchableOpacity> */}
        {/* </View> */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
          // onPress={() => selectedCoords && fetchWeeklyWeather(selectedCoords)}
        >
          <Text style={styles.searchBtnIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsWrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3478D7" />
        ) : forecast.length > 0 ? (
          <FlatList
            data={forecast}
            keyExtractor={item => item.dt.toString()}
            renderItem={({ item }) => <WeatherCard item={item} />}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View>
            <Text style={styles.emptyText}>
              Enter a city to see the forecast
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  // searchSection: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 2,
  //   // minWidth: 300,
  //   // zIndex: 1,
  // },
  // input: { flex: 1, height: 50, fontSize: 18 },
  input: {
    marginBottom: 0,
    height: 48,
    fontSize: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#c2bebe',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  list: {
    position: 'absolute',
    top: 52,
    zIndex: 10,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#c2bebe',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchButton: {
    // marginLeft: 10,
    width: 68,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3478D7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  searchBtnIcon: {
    fontSize: 30,
  },

  resultsWrapper: { flex: 1, width: '100%' },

  emptyText: {
    textAlign: 'center',
  },
});

//   // Tabs
//   bottomTabs: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     backgroundColor: '#3478D7',
//     borderRadius: 30,
//     width: '90%',
//     overflow: 'hidden',
//   },
//   tabButton: { flex: 1, padding: 15, alignItems: 'center' },
//   activeTab: { backgroundColor: '#1E56A0' },
//   tabText: { color: 'white', fontWeight: 'bold' },
