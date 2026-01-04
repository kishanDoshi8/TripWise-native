import { BText } from "@/components/ui/text";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";
import { Item } from "@/types/packingItem";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { useGetSharedItems } from "../api/get-shared-items";
import ItemModal from "./ItemModal";
import ListItem from "./ListItem";

export type ItemModalOptions = {
	showAssignees?: boolean;
};

const SharedList = () => {
	const { id }: { id: string } = useLocalSearchParams();

	const [activeItem, setActiveItem] = React.useState<Item | null>(null);
	const [openAssignees, setOpenAssignees] = React.useState<boolean>(false);
	const bottomSheetRef = React.useRef<BottomSheetModal>(null);

	useBottomSheetBackHandler(!!activeItem, () => {
		bottomSheetRef.current?.dismiss();
	});

	const {
		data: items = [],
		isPending: isSharedItemsLoading,
		// error: sharedItemsError,
		refetch: refetchSharedItems,
	} = useGetSharedItems(id);

	useEffect(() => {
		refetchSharedItems();
	}, [id]);

	return (
		<View>
			<FlatList
				data={items}
				ListHeaderComponent={<BText size={"xl2"}>Shared Items</BText>}
				ListHeaderComponentClassName='pt-4 px-4'
				refreshing={isSharedItemsLoading}
				onRefresh={refetchSharedItems}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ListItem
						item={item}
						onPress={(options?: ItemModalOptions) => {
							setOpenAssignees(options?.showAssignees ?? false);
							setActiveItem(item);
						}}
					/>
				)}
			/>

			{activeItem && (
				<ItemModal
					activeItem={activeItem}
					onDismiss={() => setActiveItem(null)}
					showAssigness={openAssignees}
				/>
			)}
		</View>
	);
};

export default SharedList;
