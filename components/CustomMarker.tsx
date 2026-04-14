import { StyleSheet, View } from 'react-native';

const CustomMarker = () => {
  return <View style={styles.custMarker} />;
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
  },
});
