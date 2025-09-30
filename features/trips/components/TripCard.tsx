import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { Trip } from "@/types/trip";
import { getDistance, getDuration, getRange } from "@/utils/dateFormatter";
import { getThumbnailSource } from "@/utils/thumbnailHelper";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, StyleProp, View, ViewStyle } from "react-native";

type Props = {
	trip: Trip;
	styles?: StyleProp<ViewStyle>;
};

export default function TripCard({ trip, styles }: Readonly<Props>) {
	return (
		<ImageBackground
			source={getThumbnailSource(trip.thumbnail)}
			style={[
				{
					height: 224,
					width: "100%",
					borderRadius: 24,
					overflow: "hidden",
				},
				styles,
			]}
			className='relative'
		>
			<LinearGradient
				colors={["transparent", "rgba(0,0,0,0.7)"]}
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					top: 0,
					zIndex: 10,
				}}
			/>

			<View
				style={{
					justifyContent: "flex-end",
					flexDirection: "row",
					marginHorizontal: 16,
					marginTop: 8,
				}}
			>
				<RText className={`bg-primary px-4 rounded-full`}>
					{getDistance(trip.startDate)}
				</RText>
			</View>

			<View
				style={{
					zIndex: 20,
					flex: 1,
					justifyContent: "flex-end",
					paddingVertical: 8,
					paddingHorizontal: 16,
				}}
			>
				<BText className='text-white text-2xl font-semibold'>
					{trip.name}
				</BText>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 4,
						gap: 4,
					}}
				>
					{ICONS.calendar(12, COLORS.foreground)}
					<RText size={"sm"}>
						{getRange(trip.startDate, trip.endDate)}
					</RText>
					{ICONS.dot(12, COLORS.primary.DEFAULT)}
					<RText size={"sm"}>
						{getDuration(trip.startDate, trip.endDate)} days
					</RText>
				</View>
			</View>
		</ImageBackground>
	);
}
