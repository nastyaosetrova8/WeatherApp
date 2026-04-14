import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRef, useState } from 'react';
import MapView, {
  Callout,
  LongPressEvent,
  Marker,
  Region,
} from 'react-native-maps';
import { Coords, IScreenProps } from '../util/interfaces';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { useIsFocused } from '@react-navigation/native';
import { mapStyle } from '../util/mapStyle';
import LinearGradient from 'react-native-linear-gradient';
import { getGradientColors } from '../util/gradientColors';
import CustomMarker from '../components/CustomMarker';
// import axios from 'axios';
// import { useIsFocused } from '@react-navigation/native';

const INITIAL_REGION: Region = {
  latitude: 48.3794,
  longitude: 31.1656,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const MapScreen: React.FC<IScreenProps> = ({ navigation }) => {
  const [marker, setMarker] = useState<Coords | null>(null);
  const { weather, isLoading, fetchCurrentWeather, setWeather } =
    useCurrentWeather();

  const mapRef = useRef<MapView | null>(null);
  const markerRef = useRef<any>(null);

  const isFocused = useIsFocused();
  // ---------
  // const fetchWeather = async (coords: Coords) => {
  //   // setIsLoading(true);
  //   try {
  //     const data = await getWeatherByCoords(coords);
  //     setWeather(data);
  //     setIsLoading(false);
  //     // console.log('Weather updated on focus');
  //     // console.log(data);

  //     setTimeout(() => {
  //       markerRef.current?.showCallout();
  //     }, 100);
  //   } catch (error: any) {
  //     console.error('Weather error:', error);

  //     console.error(error.response?.data || error.message);
  //     setIsLoading(false);
  //   }
  // };
  // --------
  // useEffect(() => {
  //   if (weather && marker) {
  //     const timer = setTimeout(() => {
  //       markerRef.current?.showCallout();
  //     }, 400);
  //     return () => clearTimeout(timer);
  //   }
  // }, [marker, weather]);

  // ===========================================
  // useEffect(() => {
  // if (isFocused && marker) {
  //     fetchWeather(marker);
  // or
  //  try {
  //    const data = await getWeatherByCoords(newCoords);
  //    setWeather(data);
  //    console.log(data);
  //  } catch (error: any) {
  //    // console.error('Weather fetching error:', error);

  //    console.error(error.response?.data || error.message);
  //  }
  //   }
  // }, [isFocused]);

  const showCalloutSafe = () => {
    setTimeout(() => {
      if (markerRef.current) {
        markerRef.current.showCallout();
      }
    }, 200);
  };

  const handleLongPress = (e: LongPressEvent) => {
    const coords = e.nativeEvent.coordinate;

    setWeather(null);
    setMarker(coords);
    // setIsLoading(true);

    mapRef.current?.animateToRegion(
      {
        ...coords,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
      800,
    );

    mapRef.current?.animateCamera(
      {
        center: coords,
        pitch: 45,
        heading: 0,
        altitude: 1000,
        zoom: 10,
      },
      { duration: 1000 },
    );

    // fetchCurrentWeather(coords, showCalloutSafe);
  };

  const handleMarkerPress = () => {
    console.log('Marker taped');
    if (isLoading) return;
    if (!weather && marker) {
      fetchCurrentWeather(marker, showCalloutSafe);
    }
  };

  const handleCalloutPress = () => {
    console.log('Navigating to Search with:', weather?.name);
    if (weather) {
      navigation.navigate('SearchScreen', {
        city: weather.name,
        coords: marker,
        // autoFocus: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.mapContainer}
        initialRegion={INITIAL_REGION}
        onLongPress={handleLongPress}
        customMapStyle={mapStyle}
        // mapType="satellite"
        // showsUserLocation
        // provider="google"
        // loadingBackgroundColor={#FFFFFF}
        // hybrid
        // terrain
        // loadingEnabled={true}
        // rotateEnabled={true}
        // zoomEnabled={true}
        // pitchEnabled={true}
        // scrollEnabled={true}
      >
        {/* {marker && <Marker coordinate={marker} />} */}

        {marker && (
          <Marker
            ref={markerRef}
            coordinate={marker}
            // key={`${marker.latitude}-${marker.longitude}`}
            // key={`marker-${marker.latitude}-${marker.longitude}`}
            key={`marker-${marker.latitude}-${marker.longitude}-${isFocused}`}
            opacity={0.99}
            tracksViewChanges={true}
            onPress={
              handleMarkerPress
              // () => {
              // console.log('Marker taped');
              // if (isLoading) return;
              // if (!weather) {
              //   fetchCurrentWeather(marker, showCalloutSafe);
              // }
              // }
            }
          >
            <CustomMarker />

            {/* {weather && weather.main ? ( */}
            <Callout
              tooltip={true}
              onPress={
                handleCalloutPress
                // () => {
                // console.log('Navigating to Search with:', weather?.name);
                // if (weather) {
                //   navigation.navigate('SearchScreen', {
                //     city: weather.name,
                //     // --------------
                //     coords: marker,
                //     // autoFocus: false,
                //     // -----------------
                //   });
                // }
                // }
              }
            >
              <View style={styles.calloutWrapper}>
                {weather ? (
                  <>
                    <LinearGradient
                      colors={getGradientColors(Math.round(weather.main.temp))}
                      style={styles.calloutGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {/* {weather ? ( */}

                      <Text style={styles.cityName}>
                        {String(weather.name)}
                        {weather.sys?.country ? `, ${weather.sys.country}` : ''}
                        {/* {weather.name} */}
                        {/* {isLoading
                    ? 'Loading...'
                    : weather
                    ? `${weather.name}, ${weather.sys?.country}`
                    : 'Unknown location'} */}
                        {/* {isLoading
                    ? 'Loading...'
                    : weather?.name || 'Unknown location'} */}
                      </Text>
                      {/* !isLoading && */}
                      <Text style={styles.weatherText}>
                        {weather.main
                          ? `${Math.round(weather.main.temp)}°C`
                          : '--°C'}

                        {weather.weather?.[0].description
                          ? ` - ${weather.weather[0].description}`
                          : ''}
                      </Text>
                      {/* )} */}
                      {/* {weather.weather?.[0] && (
                      <Text> {weather.weather[0].description}</Text>
                    )} */}
                      <Text style={styles.linkText}>Show week forecast</Text>
                    </LinearGradient>
                    <View style={styles.calloutArrowWrapper}>
                      <View
                        style={[
                          styles.calloutArrow,
                          {
                            borderTopColor: getGradientColors(
                              Math.round(weather.main.temp),
                            )[1],
                          },
                        ]}
                      />
                    </View>
                  </>
                ) : (
                  <View
                    style={[
                      styles.calloutGradient,
                      { backgroundColor: '#fff' },
                    ]}
                  >
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={{ color: '#000', marginTop: 2 }}>
                      Loading...
                    </Text>
                  </View>
                )}
              </View>
              {/* )} */}
              {/* {!isLoading && !weather && (
                  <Text style={styles.weatherText}>Failed to load weather</Text>
                )} */}
              {/* </View> */}
            </Callout>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: { flex: 1 },
  // weatherCard: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  // innerCard: { backgroundColor: 'white', padding: 15, borderRadius: 10 },
  // cityText: { fontWeight: 'bold' },
  calloutWrapper: {
    // minWidth: 160,
    minHeight: 88,
    // padding: 8,
    // backgroundColor: 'white',
    // borderRadius: 10,
    width: 200,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  calloutGradient: {
    width: '100%',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  calloutArrowWrapper: {
    backgroundColor: 'transparent',
    marginTop: -1,
  },
  calloutArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  cityName: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    elevation: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  weatherText: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    elevation: 6,

    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    // textDecorationLine: 'underline',
    elevation: 6,

    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
