import { queryClient } from "@/config/queryClientConfig";
import { toastConfig } from "@/config/toastConfig";
import AuthProvider from "@/providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import "../assets/styles/global.css";

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<View className='bg-background flex-1'>
					<Slot />
					<Toast config={toastConfig} />
				</View>
			</AuthProvider>
		</QueryClientProvider>
	);
}
