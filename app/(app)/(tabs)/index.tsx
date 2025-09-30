import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
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
import {
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";

export default function Home() {
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
		router.push(`/(app)/trip/${tripId}`);
	};

	useEffect(() => {
		if (error) showToast({ type: "error", title: getErrorMessage(error) });
	}, [error]);

	if (!user) return null;

	return (
		<SafeArea className='flex-1 bg-background'>
			<ScrollView
				stickyHeaderIndices={[1]}
				refreshControl={
					<RefreshControl
						onRefresh={onReload}
						refreshing={isPending}
						colors={[COLORS.accent.light]}
						progressBackgroundColor={COLORS.secondary.DEFAULT}
						tintColor={COLORS.accent.light}
					/>
				}
			>
				<View
					className={`bg-secondary-dark px-4 pt-8 flex-row items-center justify-between`}
				>
					<View>
						<BText className='text-2xl'>
							Hey, {user.displayName}!
						</BText>
						<RText className='text-secondary-light'>
							Ready for your next adventure?
						</RText>
					</View>
					<Avatar alt='Profile picture'>
						<AvatarFallback>
							<RText className={`capitalize`}>
								{user.displayName.charAt(0)}
							</RText>
						</AvatarFallback>
					</Avatar>
				</View>
				<View className='py-4 bg-secondary-dark px-4'>
					<Input
						placeholder='Search'
						className='rounded-full'
						icon={ICONS.search(20)}
						value={search}
						onChangeText={setSearch}
						aria-labelledby='Search'
					/>
				</View>
				<View className={`p-8`}>
					<BText className={`text-xl pb-4`}>My Trips</BText>
					<View className={`flex-1 gap-8`}>
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
			<View className={`absolute bottom-8 right-8 z-50 overflow-visible`}>
				<Button size={"iconLarge"} className={`rounded-full p-0`}>
					{ICONS.add(32, "white")}
				</Button>
			</View>
		</SafeArea>
	);
}
