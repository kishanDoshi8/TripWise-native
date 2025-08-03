import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { Trip } from "@/types/trip";
import { getDistance, getRange } from "@/utils/dateFormatter";
import { getThumbnailSource } from "@/utils/thumbnailHelper";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";

type Props = {
	trip: Trip;
};

export default function TripCard({ trip }: Readonly<Props>) {
	return (
		<Link href={`/(app)/trip/${trip.id}`} asChild>
			<TouchableOpacity className={`flex-1 w-full`}>
				<ImageBackground
					source={getThumbnailSource(trip.thumbnail)}
					style={{
						height: 224,
						width: "100%",
						borderRadius: 24,
						overflow: "hidden",
					}}
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
							marginRight: 16,
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
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								gap: 4,
							}}
						>
							{ICONS.calendar(12, COLORS.foreground)}
							<RText>
								{getRange(trip.startDate, trip.endDate)}
							</RText>
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
								trip.locationLink
									? COLORS.primary.light
									: COLORS.foreground
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
						<BText className='text-white text-2xl font-semibold'>
							{trip.name}
						</BText>
					</View>
				</ImageBackground>
			</TouchableOpacity>
		</Link>
	);
}
