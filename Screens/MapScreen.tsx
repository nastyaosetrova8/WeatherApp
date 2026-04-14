import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useRef, useState } from 'react';
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

const INITIAL_REGION: Region = {
  latitude: 48.3794,
  longitude: 31.1656,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const MapScreen: React.FC<IScreenProps> = ({ navigation, route }) => {
  const [marker, setMarker] = useState<Coords | null>(null);
  const { weather, isLoading, fetchCurrentWeather, setWeather } =
    useCurrentWeather();

  const mapRef = useRef<MapView | null>(null);
  const markerRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFocused = useIsFocused();

  const showCalloutSafe = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (markerRef.current) {
        markerRef.current.showCallout();
      }
      timeoutRef.current = null;
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (route.params?.reset) {
      setMarker(null);
      setWeather(null);
      mapRef.current?.animateToRegion(INITIAL_REGION, 800);
    }
  }, [route.params?.reset, setWeather]);

  const handleLongPress = (e: LongPressEvent) => {
    const coords = e.nativeEvent.coordinate;

    setWeather(null);
    setMarker(coords);

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
        altitude: 800,
        zoom: 10,
      },
      { duration: 800 },
    );
  };

  const handleMarkerPress = () => {
    if (isLoading) return;
    if (!weather && marker) {
      fetchCurrentWeather(marker, showCalloutSafe);
    }
  };

  const handleCalloutPress = () => {
    if (weather) {
      navigation.navigate('SearchScreen', {
        city: weather.name,
        coords: marker,
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
      >
        {marker && (
          <Marker
            ref={markerRef}
            coordinate={marker}
            key={`marker-${marker.latitude}-${marker.longitude}-${isFocused}`}
            opacity={0.99}
            tracksViewChanges={true}
            onPress={handleMarkerPress}
          >
            <CustomMarker />
            <Callout tooltip={true} onPress={handleCalloutPress}>
              <View style={styles.calloutWrapper}>
                {weather ? (
                  <>
                    <LinearGradient
                      colors={getGradientColors(Math.round(weather.main.temp))}
                      style={styles.calloutGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.cityName}>
                        {String(weather.name)}
                        {weather.sys?.country ? `, ${weather.sys.country}` : ''}
                      </Text>
                      <Text style={styles.weatherText}>
                        {weather.main
                          ? `${Math.round(weather.main.temp)}\u00B0C`
                          : '--\u00B0C'}

                        {weather.weather?.[0].description
                          ? ` - ${weather.weather[0].description}`
                          : ''}
                      </Text>
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
                    <Text style={styles.loadingTxt}>Loading...</Text>
                  </View>
                )}
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
      <View style={styles.topLabelContainer} pointerEvents="none">
        <Text style={styles.topLabelText}>{'location'.toUpperCase()}</Text>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: { flex: 1 },
  calloutWrapper: {
    minHeight: 88,
    minWidth: 200,
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
    elevation: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingTxt: { color: '#000', marginTop: 2 },
  topLabelContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    elevation: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
