import SafeArea from "@/components/ui/safeArea";
import { RText } from "@/components/ui/text";
import { useGetSharedItems } from "@/features/items/api/get-shared-items";
import SharedList from "@/features/items/components/SharedList";
import { useGetTripMembers } from "@/features/trips/api/get-members";
import { TripMemberColorsProvider } from "@/providers/TripMemberColorsProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

const TripShared = () => {
	const { id }: { id: string } = useLocalSearchParams();

	const {
		data: members = [],
		isPending: isMembersLoading,
		// error: tripMembersError,
		refetch: refetchTripMembers,
	} = useGetTripMembers(id);

	const {
		data: sharedItems = [],
		isPending: isSharedItemsLoading,
		// error: sharedItemsError,
		refetch: refetchSharedItems,
	} = useGetSharedItems(id);

	useEffect(() => {
		refetchTripMembers();
		refetchSharedItems();
	}, [id]);

	return (
		<SafeArea>
			{sharedItems.length === 0 && !isSharedItemsLoading && (
				<RText>No shared items found.</RText>
			)}
			<TripMemberColorsProvider members={members}>
				<SharedList />
			</TripMemberColorsProvider>
		</SafeArea>
	);
};

export default TripShared;
