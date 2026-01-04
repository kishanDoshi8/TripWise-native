import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { BText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useGetSharedItems } from "@/features/items/api/get-shared-items";
import { useGetTripMembers } from "@/features/trips/api/get-members";
import { useGetTripDetails } from "@/features/trips/api/get-trip-details";
import Details from "@/features/trips/components/Details";
import TripMemebers from "@/features/trips/components/TripMemebers";
import { useItemSocket } from "@/features/trips/hooks/useItemSocket";
import { useTripSocket } from "@/features/trips/hooks/useTripSocket";
import { useToast } from "@/hooks/useToast";
import { TripMemberColorsProvider } from "@/providers/TripMemberColorsProvider";
import { getErrorMessage } from "@/utils/errorMessage";
import { getThumbnailSource } from "@/utils/thumbnailHelper";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
	ActivityIndicator,
	ImageBackground,
	Pressable,
	RefreshControl,
	ScrollView,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TripDetails() {
	const insets = useSafeAreaInsets();
	const { id }: { id: string } = useLocalSearchParams();

	useTripSocket(id);
	useItemSocket(id);

	const {
		data: trip,
		isPending: isTripLoading,
		error: tripDetailsError,
		refetch: refetchTripDetails,
	} = useGetTripDetails(id);

	const {
		data: members = [],
		isPending: isMembersLoading,
		// error: tripMembersError,
		refetch: refetchTripMembers,
	} = useGetTripMembers(id);

	const { refetch: refetchSharedItems } = useGetSharedItems(id);

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

	const imageHeight = 224;

	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const openModal = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const onReload = () => {
		// Refetch all data
		refetchTripDetails();
		refetchTripMembers();
		refetchSharedItems();
	};

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
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						marginHorizontal: 16,
						marginTop: 8,
						zIndex: 50,
					}}
				>
					<Pressable
						hitSlop={10}
						accessibilityRole='button'
						onPress={() => router.back()}
					>
						{({ pressed }) => (
							<View
								className={`rounded-full h-12 w-12 items-center justify-center ${
									pressed ? "bg-secondary" : "bg-background"
								}`}
							>
								{ICONS.chevronLeft(
									24,
									COLORS.secondary.foreground
								)}
							</View>
						)}
					</Pressable>
					<Button
						size={"iconMedium"}
						color={"secondary"}
						variant='flat'
						className={`items-center rounded-full`}
						onPress={openModal}
					>
						{ICONS.settings(20, COLORS.secondary.foreground)}
					</Button>
				</View>
			</ImageBackground>

			{/* Content */}
			<ScrollView
				contentContainerStyle={{
					paddingTop: imageHeight - 24,
					paddingBottom: 32,
				}}
				style={{
					flex: 1,
					zIndex: 2,
				}}
				refreshControl={
					<RefreshControl
						onRefresh={onReload}
						refreshing={isTripLoading || isMembersLoading}
						colors={[COLORS.accent.light]}
						progressBackgroundColor={COLORS.secondary.DEFAULT}
						tintColor={COLORS.accent.light}
					/>
				}
			>
				<View className='rounded-[24px] py-4 bg-background'>
					<TripMemberColorsProvider members={members}>
						<Details trip={trip} />
						<TripMemebers members={members} />
					</TripMemberColorsProvider>
				</View>
			</ScrollView>

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
