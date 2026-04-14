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
  const { forecast, isLoading, setForecast, fetchWeeklyWeather } =
    useWeeklyWeather();

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
      return () => {
        setForecast([]);
        setSelectedCoords(null);
        googleInputRef.current?.setAddressText('');
      };
    }, [setForecast]),
  );

  useEffect(() => {
    if (route.params?.coords && route.params?.city) {
      const { coords, city } = route.params;

      if (city && coords) {
        setSelectedCoords(coords);
        fetchWeeklyWeather(coords);

        const timer = setTimeout(() => {
          if (googleInputRef.current) {
            googleInputRef.current?.setAddressText(city);
          }
        }, 400);

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

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <GooglePlacesAutocomplete
          ref={googleInputRef}
          placeholder="Type city name..."
          fetchDetails={true}
          onPress={(data, details = null) => {
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
            listView: styles.list,
          }}
          onFail={error => console.log('Google Error:', error)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
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
            contentContainerStyle={styles.contentContainer}
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
  contentContainer: { paddingBottom: 80 },
  emptyText: {
    textAlign: 'center',
  },
});
