import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";

export const useKeyboardOffset = () => {
  const keyboard = useAnimatedKeyboard();
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));
  return animatedStyles;
};
