import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { BText } from "@/components/ui/text";
import { ICONS } from "@/constants/icons";
import { Item } from "@/types/packingItem";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect } from "react";
import { TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import { useUpdateSharedItem } from "../api/update-shared-item";

type Props = {
	item: Item;
	onDismiss: () => void;
};

const UpdateQuantity = ({ item, onDismiss }: Readonly<Props>) => {
	const [quantity, setQuantity] = React.useState(item.quantity);
	const { mutate: updateItem } = useUpdateSharedItem();

	const inputRef = React.useRef<TextInput>(null);
	const [snapIndex, setSnapIndex] = React.useState<number>(0);

	const bottomSheetRef = React.useRef<BottomSheetModal>(null);

	useEffect(() => {
		if (bottomSheetRef?.current && item) {
			setQuantity(item.quantity);
			bottomSheetRef.current?.present();
		}
	}, [item]);

	const onUpdate = () => {
		if (!bottomSheetRef?.current) return;

		updateItem({
			itemId: item.id,
			tripId: item.tripId,
			data: { quantity },
		});

		onDismiss();
		bottomSheetRef.current?.dismiss();
	};

	const handleInputFocus = () => {
		setSnapIndex(2);

		setTimeout(() => {
			const text = quantity.toString();
			inputRef.current?.setNativeProps({
				selection: { start: 0, end: text.length },
			});
		}, 10);
	};

	return (
		<BottomModal
			ref={bottomSheetRef}
			index={snapIndex}
			snapPoints={["40%", "75%"]}
			enablePanDownToClose={true}
			enableDismissOnClose={true}
			onDismiss={() => onDismiss()}
		>
			<BottomSheetView>
				<Animated.View className='justify-center py-4 px-6'>
					<BText size='lg' className='mb-4'>
						Update Quantity
					</BText>
					<View className='flex-row items-center gap-4 justify-center mb-6'>
						<Button
							size={"lg"}
							color={"secondary"}
							onPress={() => setQuantity((prev) => prev - 1)}
						>
							<BText>{ICONS.remove(24)}</BText>
						</Button>
						<Input
							ref={inputRef}
							keyboardType='number-pad'
							value={quantity.toString()}
							onChangeText={(text) => setQuantity(Number(text))}
							className='w-24 text-center'
							onFocus={handleInputFocus}
						/>
						<Button
							size={"lg"}
							color={"secondary"}
							onPress={() => setQuantity((prev) => prev + 1)}
						>
							<BText>{ICONS.add(24)}</BText>
						</Button>
					</View>
					<Button onPress={onUpdate} fullWidth={true}>
						<BText>Update</BText>
					</Button>
				</Animated.View>
			</BottomSheetView>
		</BottomModal>
	);
};

export default UpdateQuantity;
