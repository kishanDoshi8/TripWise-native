import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { Trip } from "@/types/trip";
import { getDuration, getRange } from "@/utils/dateFormatter";
import React from "react";
import { View } from "react-native";

type Props = {
	trip: Trip;
};

export default function Details({ trip }: Readonly<Props>) {
	return (
		<View className={`px-4`}>
			<View className={`justify-between flex-row items-center mb-4`}>
				<BText className='text-3xl'>{trip.name}</BText>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 4,
					gap: 4,
				}}
			>
				{ICONS.location(
					12,
					trip.locationLink ? COLORS.primary.light : COLORS.foreground
				)}
				<BText
					className={`${
						trip.locationLink
							? "text-primary-light"
							: "text-foreground"
					}`}
				>
					{trip.locationName}
				</BText>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 4,
					gap: 6,
				}}
			>
				{ICONS.calendar(12, COLORS.foreground)}
				<RText>{getRange(trip.startDate, trip.endDate)}</RText>
				{ICONS.dot(12, COLORS.primary.DEFAULT)}
				<RText>{getDuration(trip.startDate, trip.endDate)} days</RText>
			</View>
			{trip.description && (
				<>
					<BText className={`mt-4 text-secondary-light`}>
						Summary
					</BText>
					<RText>{trip.description}</RText>
				</>
			)}
		</View>
	);
}
