import { queryClient } from "@/config/queryClientConfig";
import { toastConfig } from "@/config/toastConfig";
import AuthProvider from "@/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import "../assets/styles/global.css";

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<SocketProvider>
							<View className='bg-background flex-1'>
								<Slot />
								<PortalHost />
								<Toast config={toastConfig} />
							</View>
						</SocketProvider>
					</AuthProvider>
				</QueryClientProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}
