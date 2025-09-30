import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/Input";
import SafeArea from "@/components/ui/safeArea";
import { BText, IText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useGetTripInvites } from "@/features/trips/api/get-invited-trips";
import TripInvite from "@/features/trips/components/TripInvite";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/providers/AuthProvider";
import { getErrorMessage } from "@/utils/errorMessage";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function Invites() {
	const { user } = useAuth();
	const { showToast } = useToast();
	const { data: trips, isPending, refetch, error } = useGetTripInvites();

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

	if (!user) return null;
	if (error) showToast({ type: "error", title: getErrorMessage(error) });

	return (
		<SafeArea className={`flex-1 bg-background`}>
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
						<BText className='text-2xl'>Invites</BText>
						<RText className='text-secondary-light'>
							Your next trip is just one RSVP away.
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
					<BText className={`text-xl pb-4`}>Trip Requests</BText>
					<View className={`flex-1 gap-8`}>
						{filteredTrips?.map((trip) => (
							<TripInvite key={trip.id} trip={trip} />
						))}
					</View>
					{!isPending &&
						!debouncedSearch &&
						filteredTrips?.length === 0 && (
							<IText>
								No invites? Maybe it's time to start planning
								your own adventure ✈️
							</IText>
						)}
					{debouncedSearch.length > 0 &&
						filteredTrips?.length === 0 && (
							<IText>
								We looked everywhere — even under the seat — and
								found no trips 🧳
							</IText>
						)}
				</View>
			</ScrollView>
		</SafeArea>
	);
}
