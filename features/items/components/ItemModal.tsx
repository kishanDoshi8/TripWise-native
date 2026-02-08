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
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { useGetTripMembers } from "@/features/trips/api/get-members";
import MemberAvatar from "@/features/trips/components/MemberAvatar";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";
import { useToast } from "@/hooks/useToast";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { MemberUser } from "@/types/member";
import { Item } from "@/types/packingItem";
import { getErrorMessage } from "@/utils/errorMessage";
import {
	BottomSheetFooter,
	BottomSheetFooterProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { getItem } from "expo-secure-store";
import React, { useCallback, useEffect } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddItem } from "../api/add-item";
import { useDeleteItem } from "../api/delete-shared-item";
import { useGetChecklists } from "../api/get-checklists";
import { useUpdateSharedItem } from "../api/update-shared-item";
import ItemChecklistModal from "./ItemChecklistModal";

type Props = {
	activeItem: Item | (Partial<Item> & { tripId: string });
	onDismiss: () => void;
	showAssignees: boolean;
};

const ItemModal = ({
	activeItem,
	onDismiss,
	showAssignees,
}: Readonly<Props>) => {
	const insets = useSafeAreaInsets();
	const { showToast } = useToast();
	const { mutate: updateItem } = useUpdateSharedItem();
	const { mutate: addItem } = useAddItem();
	const { mutate: deleteItem } = useDeleteItem();
	const bottomSheetRef = React.useRef<BottomSheetModal>(null);
	const itemNameInputRef = React.useRef<TextInput | null>(null);

	// check if activeItem is NewItem or Item
	let item = activeItem;
	let mode = "edit";
	if (!("id" in activeItem)) {
		mode = "create";
		item = {
			id: "",
			tripId: activeItem.tripId,
			name: "",
			description: "",
			quantity: 1,
			assignees: [],
			packedStatus: false,
			checklistId: activeItem.checklistId || null,
		};
	}

	useEffect(() => {
		if (mode === "create") {
			itemNameInputRef.current?.focus();
		}
	}, []);

	const { data: members } = useGetTripMembers(item.tripId);
	const memberColors = useTripMemberColors();
	const { data: checklists } = useGetChecklists(item.tripId);

	const [packedStatus, setPackedStatus] = React.useState<boolean>(
		item.packedStatus ?? false,
	);
	const [name, setName] = React.useState<string>(item.name ?? "");
	const [description, setDescription] = React.useState<string>(
		item.description || "",
	);
	const [assignees, setAssignees] = React.useState<MemberUser[]>(
		item.assignees || [],
	);
	const [quantity, setQuantity] = React.useState<number>(item.quantity ?? 1);
	const [checklistId, setChecklistId] = React.useState<string | null>(
		item.checklistId || null,
	);

	useFocusEffect(() => {
		if (mode === "create" && !checklistId) {
			let listId = getItem(STORAGE_KEYS.ITEM.LAST_QUICK_ADD_CHECKLIST);
			setChecklistId(listId || null);
		}
	});

	const [hasEdited, setHasEdited] = React.useState<boolean>(false);

	useEffect(() => {
		const hasChanges =
			item.name !== name ||
			item.description !== description ||
			item.packedStatus !== packedStatus ||
			item.quantity !== quantity ||
			item.assignees?.length !== assignees.length ||
			item.checklistId !== checklistId ||
			item.assignees?.some((a, i) => a.id !== assignees[i].id);

		setHasEdited(hasChanges);
	}, [
		item,
		name,
		description,
		packedStatus,
		quantity,
		assignees,
		checklistId,
	]);

	const checklistModalRef = React.useRef<BottomSheetModal>(null);

	useEffect(() => {
		if (item) {
			bottomSheetRef.current?.present();
		}
	}, [item]);

	const handleRestoreItem = () => {
		setName(item.name ?? "");
		setDescription(item.description || "");
		setPackedStatus(item.packedStatus ?? false);
		setAssignees(item.assignees || []);
		setQuantity(item.quantity ?? 1);
		setChecklistId(item.checklistId ?? null);
	};

	const onModalDismiss = () => {
		if (hasEdited && item.id) {
			updateItem(
				{
					itemId: item.id,
					tripId: item.tripId,
					data: {
						name,
						description,
						packedStatus,
						assignees,
						quantity,
						checklistId,
					},
				},
				{
					onError: (error) => {
						showToast({
							type: "error",
							title: "Error updating item",
							desc: getErrorMessage(error),
						});
					},
				},
			);
		} else if (hasEdited && !item.id && name.trim().length > 0) {
			addItem(
				{
					tripId: item.tripId,
					name,
					description,
					packedStatus,
					assignees,
					quantity,
					checklistId,
				},
				{
					onError: (error) => {
						showToast({
							type: "error",
							title: "Error adding item",
							desc: getErrorMessage(error),
						});
					},
				},
			);
		}

		bottomSheetRef.current?.dismiss();
		onDismiss();
	};

	useBottomSheetBackHandler(!!item, () => {
		bottomSheetRef.current?.dismiss();
	});

	const handleAssignees = (member: MemberUser) => {
		const isAssigned = assignees.some((a) => a.id === member.id);
		setAssignees((prev) =>
			isAssigned
				? prev.filter((a) => a.id !== member.id)
				: [...prev, member],
		);
	};

	const renderFooter = useCallback(
		(props: BottomSheetFooterProps) => (
			<BottomSheetFooter {...props}>
				<View>
					<RText className='text-center text-sm text-secondary-light pb-4'>
						Show at the bottom
					</RText>
				</View>
			</BottomSheetFooter>
		),
		[],
	);

	const handleChecklistPress = () => {
		// dismiss keyboard
		Keyboard.dismiss();
		checklistModalRef.current?.present();
	};

	const renderHandle = React.useCallback(() => {
		return (
			<View className={`flex-row items-center justify-between p-4`}>
				{hasEdited ? (
					<Button
						onPress={handleRestoreItem}
						variant='flat'
						size={"sm"}
						color='accent'
						className={`mt-1`}
					>
						<RText>undo</RText>
					</Button>
				) : (
					<Button
						// onPress={handleDeleteItem}
						variant='ghost'
						size={"icon"}
						color='danger'
						className={`mt-1`}
						icon={ICONS.delete(24, COLORS.danger.DEFAULT)}
					></Button>
				)}
				<Button
					color={"secondary"}
					variant={"flat"}
					icon={ICONS.arrowDown(24)}
					onPress={handleChecklistPress}
				>
					<>
						{checklistId ? (
							<RText>
								{checklists?.find((c) => c.id === checklistId)
									?.name ?? "Shared List"}
							</RText>
						) : (
							<RText>Shared List</RText>
						)}
					</>
				</Button>
				<Button
					onPress={onDismiss}
					variant='ghost'
					size={"icon"}
					color='secondary'
					className={`mt-1 ml-2`}
					icon={ICONS.check(24, COLORS.primary.DEFAULT)}
				></Button>
			</View>
		);
	}, [checklistId, checklists, hasEdited]);

	return (
		<>
			<BottomModal
				ref={bottomSheetRef}
				snapPoints={["100%"]}
				index={mode === "create" ? 1 : 0}
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
						{item && (
							<View
								className={`mt-4 mb-4 flex-1 gap-4 px-4 pb-8`}
							>
								<Pressable
									onPress={() =>
										setPackedStatus((prev) => !prev)
									}
									className='flex-row items-center gap-2'
									accessibilityRole='checkbox'
									accessibilityState={{
										checked: packedStatus,
									}}
								>
									<Checkbox
										checked={packedStatus}
										onCheckedChange={(v) =>
											setPackedStatus(!!v)
										}
									/>
									<RText className='text-lg'>Done</RText>
								</Pressable>
								<View className={`flex-1`}>
									<BottomSheetTextInput
										ref={itemNameInputRef}
										placeholder='Item Name'
										className={`border-0 text-2xl font-semibold p-0 outline-none text-foreground placeholder:text-secondary-light`}
										value={name}
										onChangeText={(v) => setName(v)}
										style={{
											fontFamily: "UbuntuMono_700Bold",
										}}
										autoFocus={mode === "create"}
										onSubmitEditing={onDismiss}
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
								</View>

								<View className='flex-row items-center gap-4 justify-center mb-6 mt-4'>
									<Button
										size={"lg"}
										color={"secondary"}
										onPress={() =>
											setQuantity((prev) =>
												quantity > 1 ? prev - 1 : 1,
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

								<Accordion
									type='multiple'
									collapsable
									className={`px-4 bg-secondary-dark rounded-lg`}
									defaultValue={
										showAssignees ? ["assignees"] : []
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
												Assign this item to specific
												trip members.
											</RText>
											{members && members.length > 0 && (
												<View className={`mt-4 gap-3`}>
													{members.map((member) => (
														<Pressable
															key={member.user.id}
															onPress={() =>
																handleAssignees(
																	member.user,
																)
															}
															className={`flex-row items-center gap-3`}
															accessibilityRole='checkbox'
														>
															<MemberAvatar
																member={member}
																color={
																	memberColors[
																		member
																			.user
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
																				.id,
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
																	member.user
																		.id,
															) && (
																<RText>
																	{ICONS.check(
																		24,
																		COLORS
																			.accent
																			.light,
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
							</View>
						)}
					</Animated.View>
				</BottomSheetScrollView>
			</BottomModal>
			<ItemChecklistModal
				checklistId={checklistId}
				setChecklistId={setChecklistId}
				modalRef={checklistModalRef}
			/>
		</>
	);
};

export default ItemModal;
