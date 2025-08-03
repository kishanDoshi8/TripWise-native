import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import React from "react";

export default function App() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) return <Redirect href={"/auth/email"} />;

	return <Redirect href={"/(app)/(tabs)"} />;
}
