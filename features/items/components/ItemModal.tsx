import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useGetTripMembers } from "@/features/trips/api/get-members";
import MemberAvatar from "@/features/trips/components/MemberAvatar";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { MemberUser } from "@/types/member";
import { Item } from "@/types/packingItem";
import {
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDeleteItem } from "../api/delete-shared-item";
import { useUpdateSharedItem } from "../api/update-shared-item";

type Props = {
	activeItem: Item;
	onDismiss: () => void;
	showAssigness: boolean;
};

const ItemModal = ({
	activeItem,
	onDismiss,
	showAssigness,
}: Readonly<Props>) => {
	const insets = useSafeAreaInsets();
	const { mutate: updateItem } = useUpdateSharedItem();
	const { mutate: deleteItem } = useDeleteItem();
	const bottomSheetRef = React.useRef<BottomSheetModal>(null);

	const [packedStatus, setPackedStatus] = React.useState<boolean>(
		activeItem.packedStatus
	);
	const [name, setName] = React.useState<string>(activeItem.name);
	const [description, setDescription] = React.useState<string>(
		activeItem.description || ""
	);
	const [assignees, setAssignees] = React.useState<MemberUser[]>(
		activeItem.assignees || []
	);
	const [quantity, setQuantity] = React.useState<number>(activeItem.quantity);

	const { data: members } = useGetTripMembers(activeItem.tripId);
	const memberColors = useTripMemberColors();

	const expand = () => bottomSheetRef.current?.snapToIndex(1);

	useEffect(() => {
		if (activeItem) {
			bottomSheetRef.current?.present();
		}
	}, [activeItem]);

	const handleDeleteItem = () => {
		deleteItem(
			{
				item: activeItem,
			},
			{
				onError: (error) => {
					// Handle error if needed
					console.error("Error updating item:", error);
				},
			}
		);

		bottomSheetRef.current?.dismiss();
		onDismiss();
	};

	const onModalDismiss = () => {
		const hasChanges =
			activeItem.name !== name ||
			activeItem.description !== description ||
			activeItem.packedStatus !== packedStatus ||
			activeItem.quantity !== quantity ||
			activeItem.assignees?.length !== assignees.length ||
			activeItem.assignees?.some((a, i) => a.id !== assignees[i].id);

		if (hasChanges) {
			updateItem(
				{
					itemId: activeItem.id,
					tripId: activeItem.tripId,
					data: {
						name,
						description,
						packedStatus,
						assignees,
						quantity,
					},
				},
				{
					onError: (error) => {
						// Handle error if needed
						console.error("Error updating item:", error);
					},
				}
			);
		}

		bottomSheetRef.current?.dismiss();
		onDismiss();
	};

	useBottomSheetBackHandler(!!activeItem, () => {
		bottomSheetRef.current?.dismiss();
	});

	const handleAssignees = (member: MemberUser) => {
		const isAssigned = assignees.some((a) => a.id === member.id);
		setAssignees((prev) =>
			isAssigned
				? prev.filter((a) => a.id !== member.id)
				: [...prev, member]
		);
	};

	const renderFooter = React.useCallback(() => {
		return (
			<View>
				<RText className='text-center text-sm text-secondary-light pb-4'>
					Show at the bottom
				</RText>
			</View>
		);
	}, []);

	const renderHandle = React.useCallback(() => {
		return (
			<View className={`flex-row items-center justify-between p-4`}>
				<Button
					onPress={onDismiss}
					variant='ghost'
					size={"icon"}
					color='secondary'
					className={`mt-2`}
				>
					<RText>{ICONS.chevronDown(32)}</RText>
				</Button>
				<Button
					onPress={handleDeleteItem}
					variant='ghost'
					size={"icon"}
					color='danger'
				>
					<RText>{ICONS.delete(24, COLORS.danger.DEFAULT)}</RText>
				</Button>
			</View>
		);
	}, []);

	return (
		<BottomModal
			ref={bottomSheetRef}
			snapPoints={["100%"]}
			index={0}
			enablePanDownToClose={true}
			enableDismissOnClose={true}
			bottomInset={insets.bottom}
			topInset={insets.top}
			onDismiss={onModalDismiss}
			keyboardBehavior='fillParent'
			enableDynamicSizing
			footerComponent={renderFooter}
			handleComponent={renderHandle}
		>
			<BottomSheetScrollView className={`flex-1`}>
				<Animated.View className='justify-center'>
					{activeItem && (
						<View className={`mt-4 mb-4 flex-1 gap-4 px-4`}>
							<Pressable
								onPress={() => setPackedStatus((prev) => !prev)}
								className='flex-row items-center gap-2'
								accessibilityRole='checkbox'
								accessibilityState={{ checked: packedStatus }}
							>
								<Checkbox
									checked={packedStatus}
									onCheckedChange={(v) =>
										setPackedStatus(!!v)
									}
								/>
								<RText className='text-lg'>Done</RText>
							</Pressable>
							<BottomSheetTextInput
								placeholder='Item Name'
								className={`border-0 text-2xl font-semibold p-0 outline-none text-foreground placeholder:text-secondary-light`}
								value={name}
								onChangeText={(v) => setName(v)}
								style={{
									fontFamily: "UbuntuMono_700Bold",
								}}
							/>
							<BottomSheetTextInput
								multiline
								numberOfLines={50}
								placeholder='Add notes...'
								textAlignVertical='top'
								className={`placeholder:text-secondary-light text-foreground`}
								value={description}
								onChangeText={(v) => setDescription(v)}
								style={{
									fontFamily: "UbuntuMono_400Regular",
								}}
							/>

							<Accordion
								type='multiple'
								collapsable
								className={`px-4 bg-secondary-dark rounded-lg`}
								defaultValue={
									showAssigness ? ["assignees"] : []
								}
							>
								<AccordionItem value='assignees'>
									<AccordionTrigger>
										<RText className='text-lg'>
											Assignees
										</RText>
									</AccordionTrigger>
									<AccordionContent className={`py-4`}>
										<RText className='text-secondary-light'>
											Assign this item to specific trip
											members.
										</RText>
										{members && members.length > 0 && (
											<View className={`mt-4 gap-3`}>
												{members.map((member) => (
													<Pressable
														key={member.user.id}
														onPress={() =>
															handleAssignees(
																member.user
															)
														}
														className={`flex-row items-center gap-3`}
														accessibilityRole='checkbox'
													>
														<MemberAvatar
															member={member}
															color={
																memberColors[
																	member.user
																		.id
																]
															}
														/>
														<RText
															className={`text-lg flex-1 ${
																assignees.some(
																	(a) =>
																		a.id ===
																		member
																			.user
																			.id
																) &&
																"text-accent-light"
															}`}
														>
															{
																member.user
																	.displayName
															}
														</RText>
														{assignees.some(
															(a) =>
																a.id ===
																member.user.id
														) && (
															<RText>
																{ICONS.check(
																	24,
																	COLORS
																		.accent
																		.light
																)}
															</RText>
														)}
													</Pressable>
												))}
											</View>
										)}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<View className='flex-row items-center gap-4 justify-center mb-6 mt-4'>
								<Button
									size={"lg"}
									color={"secondary"}
									onPress={() =>
										setQuantity((prev) =>
											quantity > 1 ? prev - 1 : 1
										)
									}
								>
									<BText>{ICONS.remove(24)}</BText>
								</Button>
								<BottomSheetTextInput
									keyboardType='number-pad'
									value={quantity.toString()}
									onChangeText={(text) => {
										const n = Number(text);
										if (!Number.isNaN(n)) {
											setQuantity(n);
										}
									}}
									onBlur={() => {
										setQuantity((q) => Math.max(1, q));
									}}
									className='w-24 text-center text-foreground border-2 border-secondary rounded-lg focus:border-primary'
								/>
								<Button
									size={"lg"}
									color={"secondary"}
									onPress={() =>
										setQuantity((prev) => prev + 1)
									}
								>
									<BText>{ICONS.add(24)}</BText>
								</Button>
							</View>
						</View>
					)}
				</Animated.View>
			</BottomSheetScrollView>
		</BottomModal>
	);
};

export default ItemModal;
