import { useAuth } from "@/providers/AuthProvider";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";

let hasRedirected = false;

const TripsLayout = () => {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user?.lastTripId && !hasRedirected) {
			hasRedirected = true;
			router.push(`/(app)/trips/${user.lastTripId}/(tabs)`);
		}
	}, [user]);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "slide_from_right",
				gestureDirection: "horizontal",
			}}
		/>
	);
};

export default TripsLayout;
