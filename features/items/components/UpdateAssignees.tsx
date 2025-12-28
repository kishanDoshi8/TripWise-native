import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { RText } from "@/components/ui/text";
import { Item } from "@/types/packingItem";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect } from "react";
import Animated from "react-native-reanimated";
import { useUpdateSharedItem } from "../api/update-shared-item";

type Props = {
	item: Item;
	onDismiss: () => void;
};

export const UpdateAssignees = ({ item, onDismiss }: Readonly<Props>) => {
	const [assignees, setAssignees] = React.useState(item.assignees);
	const { mutate: updateItem } = useUpdateSharedItem();
	const bottomSheetRef = React.useRef<BottomSheetModal>(null);

	useEffect(() => {
		if (bottomSheetRef?.current && item) {
			setAssignees(item.assignees);
			bottomSheetRef.current?.present();
		}
	}, [item]);

	const onUpdate = () => {
		if (!bottomSheetRef?.current) return;

		updateItem({
			itemId: item.id,
			tripId: item.tripId,
			data: { assignees },
		});

		onDismiss();
		bottomSheetRef.current?.dismiss();
	};

	return (
		<BottomModal
			ref={bottomSheetRef}
			index={0}
			snapPoints={["40%", "75%"]}
			enablePanDownToClose={true}
			enableDismissOnClose={true}
			onDismiss={() => onDismiss()}
		>
			<BottomSheetView>
				<Animated.View className='justify-center py-4 px-6'>
					<Button>
						<RText>Update Assignees (UI not implemented)</RText>
					</Button>
				</Animated.View>
			</BottomSheetView>
		</BottomModal>
	);
};
