import {
  UbuntuMono_400Regular,
  UbuntuMono_400Regular_Italic,
  UbuntuMono_700Bold,
  useFonts,
} from "@expo-google-fonts/ubuntu-mono";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export const useAppFonts = () => {
  const [loaded, error] = useFonts({
    UbuntuMono_400Regular,
    UbuntuMono_400Regular_Italic,
    UbuntuMono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return { loaded, error };
};
