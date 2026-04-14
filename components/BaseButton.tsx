import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BaseButtonProps } from '../util/interfaces';

function BaseButton({ children, onPress, mode, style }: BaseButtonProps) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === 'flat' && styles.flat]}>
          <Text style={[styles.btnText, mode === 'flat' && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default BaseButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'black',
  },
  flat: {
    backgroundColor: 'transparent',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
  flatText: {
    color: 'white',
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: '#10d513',
    borderRadius: 4,
  },
});
