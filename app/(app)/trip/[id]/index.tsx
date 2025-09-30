import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { BText, RText } from "@/components/ui/text";
import { useGetTripMembers } from "@/features/trips/api/get-members";
import { useGetTripDetails } from "@/features/trips/api/get-trip-details";
import Details from "@/features/trips/components/Details";
import TripMemebers from "@/features/trips/components/TripMemebers";
import { useToast } from "@/hooks/useToast";
import { getDistance } from "@/utils/dateFormatter";
import { getErrorMessage } from "@/utils/errorMessage";
import { getThumbnailSource } from "@/utils/thumbnailHelper";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
	ActivityIndicator,
	ImageBackground,
	ScrollView,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TripDetails() {
	const insets = useSafeAreaInsets();
	const { id }: { id: string } = useLocalSearchParams();

	const {
		data: trip,
		isPending: isTripLoading,
		error: tripDetailsError,
	} = useGetTripDetails(id);

	const {
		data: members = [],
		isPending: isMembersLoading,
		error: tripMembersError,
	} = useGetTripMembers(id);

	const { showToast } = useToast();

	useEffect(() => {
		if (tripDetailsError) {
			showToast({
				type: "error",
				title: "Error getting trip details",
				desc: getErrorMessage(tripDetailsError),
			});
		}
	}, [tripDetailsError]);

	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const openModal = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const imageHeight = 224;

	if (isTripLoading || !trip)
		return (
			<ActivityIndicator className='flex-1 bg-background' size='large' />
		);

	return (
		<View className='flex-1 bg-background'>
			{/* Background image */}
			<ImageBackground
				source={getThumbnailSource(trip?.thumbnail)}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: imageHeight,
					zIndex: 1,
				}}
			>
				<View
					style={{
						height: insets.top,
						backgroundColor: "rgba(0,0,0,0.3)",
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
					<RText className='bg-primary px-4 rounded-full'>
						{getDistance(trip.startDate)}
					</RText>
				</View>
			</ImageBackground>

			{/* Content */}
			<ScrollView
				contentContainerStyle={{
					paddingTop: imageHeight - 24,
				}}
				style={{
					flex: 1,
					zIndex: 2,
				}}
			>
				<View className='rounded-[24px] py-4 bg-background'>
					<Details trip={trip} />
					<TripMemebers members={members} />
				</View>
			</ScrollView>
			<Button onPress={openModal}>
				<BText>Open</BText>
			</Button>

			<BottomModal
				ref={bottomSheetRef}
				index={0}
				snapPoints={["25%", "50%"]}
				enablePanDownToClose={false}
			>
				<BottomSheetView style={{ padding: 20 }}>
					<Button onPress={() => bottomSheetRef.current?.dismiss()}>
						<BText>Close</BText>
					</Button>
				</BottomSheetView>
			</BottomModal>
		</View>
	);
}
