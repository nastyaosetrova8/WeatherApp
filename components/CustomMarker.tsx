import { StyleSheet, View } from 'react-native';

const CustomMarker = () => {
  // const scaleAnim = useRef(new Animated.Value(1)).current;

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(scaleAnim, {
  //         toValue: 1.8,
  //         duration: 200,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(scaleAnim, {
  //         toValue: 1,
  //         duration: 200,
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //   ).start();
  // }, [scaleAnim]);

  return (
    <View
      style={
        styles.custMarker
        // {
        //   transform: [{ scale: scaleAnim }],
        //   opacity: scaleAnim.interpolate({
        //     inputRange: [1, 1.8],
        //     outputRange: [1, 0.3],
        //   }),
        // },
      }
    />
  );
};

export default CustomMarker;

const styles = StyleSheet.create({
  custMarker: {
    width: 28,
    height: 28,
    borderRadius: 15,
    backgroundColor: 'red',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
