import SafeArea from "@/components/ui/safeArea";
import { RText } from "@/components/ui/text";
import { ICONS } from "@/constants/icons";
import { useKeyboardOffset } from "@/hooks/useKeyboardOffset";
import { useAuth } from "@/providers/AuthProvider";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated from "react-native-reanimated";

export default function AuthLayout() {
	const animatedStyles = useKeyboardOffset();
	const router = useRouter();
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			router.replace({ pathname: "/(app)/(tabs)" });
		}
	}, [isAuthenticated]);

	if (isLoading) {
		return (
			<View className={`flex-1 items-center justify-center`}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<SafeArea className={`h-full w-full`}>
			<Animated.View
				style={[animatedStyles]}
				className={`justify-between my-24 flex-1`}
			>
				<View className={`flex-row justify-center items-center gap-2`}>
					{ICONS.logo(32, "white")}
					<RText size={"xl2"}>TripWise</RText>
				</View>
				<View className={`mx-8 gap-4`}>
					<View className={`items-center gap-2 mb-28`}>
						<RText variant={"light"} size={"xl4"}>
							Join the Group!
						</RText>
						<RText variant={"secondary"}>Plan. Pack. Go.</RText>
					</View>
					<Slot />
				</View>
			</Animated.View>
		</SafeArea>
	);
}
