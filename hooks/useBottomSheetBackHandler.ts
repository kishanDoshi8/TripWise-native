import { useFocusEffect } from "expo-router";
import React from "react";
import { BackHandler } from "react-native";

export function useBottomSheetBackHandler(
  isOpen: boolean,
  onClose: () => void
) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isOpen) {
          onClose();
          return true;
        }
        return false;
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => sub.remove();
    }, [isOpen, onClose])
  );
}
