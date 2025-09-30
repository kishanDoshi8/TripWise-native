import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Redirect href='/auth/email' />;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "simple_push",
				gestureDirection: "horizontal",
			}}
		/>
	);
}
