import SafeArea from "@/components/ui/safeArea";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { useGetSharedItems } from "@/features/items/api/get-shared-items";
import SharedList from "@/features/items/components/SharedList";
import { useGetTripMembers } from "@/features/trips/api/get-members";
import { useToast } from "@/hooks/useToast";
import { TripMemberColorsProvider } from "@/providers/TripMemberColorsProvider";
import { setItem } from "@/utils/asyncStore";
import { getErrorMessage } from "@/utils/errorMessage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

const TripShared = () => {
	const { id }: { id: string } = useLocalSearchParams();
	const { showToast } = useToast();
	useFocusEffect(() => {
		setItem(STORAGE_KEYS.UI.SELECTED_TAB, "shared");
	});

	const { data: members = [], refetch: refetchTripMembers } =
		useGetTripMembers(id);

	const {
		refetch: refetchSharedItems,
		error: sharedItemsError,
		isError: isSharedItemsError,
	} = useGetSharedItems(id);

	useEffect(() => {
		refetchTripMembers();
		refetchSharedItems();
	}, [id]);

	useEffect(() => {
		if (isSharedItemsError && sharedItemsError) {
			showToast({
				type: "error",
				title: "Error loading shared items",
				desc: getErrorMessage(sharedItemsError),
			});
		}
	}, [isSharedItemsError, sharedItemsError]);

	return (
		<SafeArea>
			<TripMemberColorsProvider members={members}>
				<SharedList />
			</TripMemberColorsProvider>
		</SafeArea>
	);
};

export default TripShared;
