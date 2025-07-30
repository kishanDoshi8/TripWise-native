import { queryClient } from "@/config/queryClientConfig";
import AuthProvider from "@/providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../assets/styles/global.css";

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<StatusBar style='light' />
				<Slot />
			</AuthProvider>
		</QueryClientProvider>
	);
}
