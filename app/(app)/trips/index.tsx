import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import RefreshControl from "@/components/ui/refresh-control";
import SafeArea from "@/components/ui/safeArea";
import { BText, IText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useGetUpcomingTrips } from "@/features/trips/api/get-upcoming-trips";
import TripCard from "@/features/trips/components/TripCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/providers/AuthProvider";
import { getErrorMessage } from "@/utils/errorMessage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Trips() {
	const { user, setLastSelectedTrip } = useAuth();
	const router = useRouter();
	const { showToast } = useToast();

	const { data: trips, isPending, refetch, error } = useGetUpcomingTrips();

	const [search, setSearch] = useState("");
	const [filteredTrips, setFilteredTrips] = useState(trips);

	const debouncedSearch = useDebounce(search);

	useEffect(() => {
		if (!debouncedSearch) {
			setFilteredTrips(trips);
			return;
		}

		const lowerSearch = debouncedSearch.toLowerCase();

		const filtered = trips?.filter(
			(trip) =>
				trip.name.toLowerCase().includes(lowerSearch) ||
				trip.description?.toLowerCase().includes(lowerSearch) ||
				trip.locationName.toLowerCase().includes(lowerSearch)
		);

		setFilteredTrips(filtered);
	}, [trips, debouncedSearch]);

	const onReload = () => {
		refetch();
	};

	const handleTripNavigate = (tripId: string) => {
		setLastSelectedTrip(tripId);
		router.push(`/(app)/trips/${tripId}/(tabs)`);
	};

	useEffect(() => {
		if (error) showToast({ type: "error", title: getErrorMessage(error) });
	}, [error]);

	if (!user) return null;

	return (
		<SafeArea className='flex-1 bg-background'>
			<ScrollView
				stickyHeaderIndices={[0]}
				className={`pb-8`}
				refreshControl={
					<RefreshControl
						onRefresh={onReload}
						refreshing={isPending}
					/>
				}
			>
				<View
					className={`bg-background py-8 z-50 flex-row items-center justify-between`}
				>
					<View className={`m-auto`}>
						<BText className='text-2xl'>Trips</BText>
					</View>
				</View>
				<View className={`p-4`} style={{ paddingBottom: 72 }}>
					<View className={`flex-1 gap-8`}>
						<View>
							<Input
								placeholder='Search'
								className='rounded-full'
								icon={ICONS.search(20)}
								value={search}
								onChangeText={setSearch}
								aria-labelledby='Search'
							/>
						</View>
						{filteredTrips?.map((trip) => (
							<TouchableOpacity
								key={trip.id}
								className='flex-1 w-full'
								onPress={() => handleTripNavigate(trip.id)}
							>
								<TripCard trip={trip} />
							</TouchableOpacity>
						))}
					</View>
					{!isPending &&
						!debouncedSearch &&
						filteredTrips?.length === 0 && (
							<IText>
								Your adventure board is empty. Let’s plan
								something epic!
							</IText>
						)}
					{debouncedSearch.length > 0 &&
						filteredTrips?.length === 0 && (
							<IText>
								You’ve got no upcoming trips matching ‘
								{debouncedSearch}’. Maybe it’s on the wish list?
							</IText>
						)}
				</View>
			</ScrollView>
			<View className={`absolute bottom-8 left-8 right-8`}>
				<Button
					fullWidth
					variant='solid'
					color={"primary"}
					size={"lg"}
					onPress={() => router.push(`/(app)/trips/new`)}
					icon={ICONS.add(32, COLORS.foreground)}
					className={`shadow-lg shadow-primary/30`}
				>
					<RText>Create New Trip</RText>
				</Button>
			</View>
		</SafeArea>
	);
}
