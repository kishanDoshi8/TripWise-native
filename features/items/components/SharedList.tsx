import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import RefreshControl from "@/components/ui/refresh-control";
import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useBottomSheetBackHandler } from "@/hooks/useBottomSheetBackHandler";
import { Item } from "@/types/packingItem";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { KeyboardAvoidingView, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAddItem } from "../api/add-item";
import { useGetChecklists } from "../api/get-checklists";
import { useGetSharedItems } from "../api/get-shared-items";
import ItemModal from "./ItemModal";
import ListItem from "./ListItem";

export type ItemModalOptions = {
	showAssignees?: boolean;
};

const SharedList = () => {
	const { id }: { id: string } = useLocalSearchParams();
	const { mutate: addItemMutate } = useAddItem();

	const [activeItem, setActiveItem] = React.useState<
		Item | (Partial<Item> & { tripId: string }) | null
	>(null);
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

	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const [quickAddItemName, setQuickAddItemName] = React.useState<string>("");
	const searchInputRef = React.useRef<TextInput | null>(null);
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return items;
		return items.filter(
			(item) =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()),
		);
	}, [items, searchQuery]);

	const { data: checklists = [] } = useGetChecklists(id);

	const sections = useMemo(() => {
		const checklistMap = new Map(
			checklists.map((c) => [
				c.id,
				{ title: c.name, id: c.id, data: [] as typeof items },
			]),
		);

		const untitled = {
			title: "Shared List",
			id: "shared-list",
			data: [] as typeof items,
		};

		for (const item of filteredItems) {
			if (item.checklistId && checklistMap.has(item.checklistId)) {
				checklistMap.get(item.checklistId)!.data.push(item);
			} else {
				untitled.data.push(item);
			}
		}

		return [
			...Array.from(checklistMap.values()).filter(
				(s) => s.data.length > 0,
			),
			...(untitled.data.length ? [untitled] : []),
		];
	}, [filteredItems, checklists]);

	useEffect(() => {
		refetchSharedItems();
	}, [id]);

	const handleAddItem = () => {
		if (quickAddItemName.trim() === "") {
			setActiveItem({ tripId: id });
			return;
		}

		addItemMutate({
			tripId: id,
			name: quickAddItemName.trim(),
		});
		setQuickAddItemName("");
	};

	return (
		<>
			<Animated.ScrollView
				className={`flex-1 bg-background`}
				refreshControl={
					<RefreshControl
						onRefresh={refetchSharedItems}
						refreshing={isSharedItemsLoading}
					/>
				}
				stickyHeaderIndices={[0]}
				scrollEventThrottle={16}
			>
				<View
					className={`bg-background flex-row justify-between items-center px-4 py-2`}
				>
					<Button
						size={"iconMedium"}
						color={"secondary"}
						variant='ghost'
						className={`items-center rounded-full`}
						onPress={() => router.back()}
					>
						{ICONS.chevronLeft(24, COLORS.secondary.foreground)}
					</Button>
					<BText className={`text-center`} size='lg'>
						Shared Items
					</BText>
					<Button
						size={"iconMedium"}
						color={"secondary"}
						variant='ghost'
						className={`items-center rounded-full`}
					>
						{ICONS.options(24, COLORS.secondary.foreground)}
					</Button>
				</View>
				{items.length === 0 && !isSharedItemsLoading && (
					<RText className={`text-center mt-4`}>
						No shared items found.
					</RText>
				)}
				{sections.map((section) => (
					<Accordion
						key={section.id}
						type='multiple'
						defaultValue={[section.id]}
						collapsable
						className={`m-2 p-4 rounded-lg bg-secondary-dark`}
					>
						<AccordionItem value={section.id}>
							<AccordionTrigger>
								<RText className={`text-xl`}>
									{section.title}
								</RText>
							</AccordionTrigger>
							<AccordionContent>
								{section.data.map((item) => (
									<ListItem
										key={item.id}
										item={item}
										onPress={(options) => {
											setActiveItem(item);
											setOpenAssignees(
												options?.showAssignees || false,
											);
										}}
									/>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				))}
			</Animated.ScrollView>

			<KeyboardAvoidingView
				behavior='padding'
				keyboardVerticalOffset={34}
			>
				<View
					style={{
						borderTopWidth: 2,
						paddingHorizontal: 16,
						paddingTop: 16,
						paddingBottom: 8,
						boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.3)",
					}}
					className={`bg-secondary-dark border-background flex-row items-center gap-2`}
				>
					<Input
						ref={searchInputRef}
						placeholder='Quick add item...'
						wrapperClassName='flex-1'
						className={`rounded-full flex-1`}
						value={quickAddItemName}
						onChangeText={(text) => setQuickAddItemName(text)}
						size={"lg"}
						icon={ICONS.search(20, COLORS.secondary.light)}
						onSubmitEditing={handleAddItem}
					/>
					<Button
						size={"iconMedium"}
						className={`rounded-full`}
						onPress={handleAddItem}
					>
						<RText>
							{quickAddItemName.trim() === ""
								? ICONS.postAdd(24, COLORS.secondary.foreground)
								: ICONS.add(24, COLORS.secondary.foreground)}
						</RText>
					</Button>
				</View>
			</KeyboardAvoidingView>

			{activeItem && (
				<ItemModal
					activeItem={activeItem}
					onDismiss={() => setActiveItem(null)}
					showAssignees={openAssignees}
				/>
			)}
		</>
	);
};

export default SharedList;
