import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getGradientColors } from '../util/gradientColors';

const WeatherCard = ({ item, index }: any) => {
  const iconCode = item.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
  });

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  return (
    <Animated.View
      style={[
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={getGradientColors(Math.round(item.main.temp))}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.dayText}>{dayName}</Text>

        <View style={styles.tempContainer}>
          <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
          <Text style={styles.tempText}>
            {`${Math.round(item.main.temp)}\u00B0C`}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default WeatherCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  tempText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
