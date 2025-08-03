import SafeArea from "@/components/ui/safeArea";
import { RText } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function TripDetails() {
	const { id } = useLocalSearchParams();

	return (
		<SafeArea className={`flex-1 bg-background`}>
			<RText>{id}</RText>
		</SafeArea>
	);
}
