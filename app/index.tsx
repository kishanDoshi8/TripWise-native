import { useAppFonts } from "@/utils/fonts";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
	const { loaded, error } = useAppFonts();

	if (!loaded && !error) {
		return null;
	}

	return <Redirect href={"/auth/email"} />;
}
