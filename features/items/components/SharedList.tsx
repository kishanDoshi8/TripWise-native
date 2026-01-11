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
import { TextInput, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useGetChecklists } from "../api/get-checklists";
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

	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const searchInputRef = React.useRef<TextInput | null>(null);
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return items;
		return items.filter(
			(item) =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description
					?.toLowerCase()
					.includes(searchQuery.toLowerCase())
		);
	}, [items, searchQuery]);

	const { data: checklists = [] } = useGetChecklists(id);

	const sections = useMemo(() => {
		const checklistMap = new Map(
			checklists.map((c) => [
				c.id,
				{ title: c.name, id: c.id, data: [] as typeof items },
			])
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
				(s) => s.data.length > 0
			),
			...(untitled.data.length ? [untitled] : []),
		];
	}, [filteredItems, checklists]);

	useEffect(() => {
		refetchSharedItems();
	}, [id]);

	const scrollY = useSharedValue(0);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollY.value,
						[0, 10],
						[0, 80],
						Extrapolation.CLAMP
					),
				},
			],
			opacity: interpolate(
				scrollY.value,
				[0, 10],
				[1, 0],
				Extrapolation.CLAMP
			),
		};
	});

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

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
				onScroll={scrollHandler}
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
				<Input
					ref={searchInputRef}
					placeholder='Search'
					className={`mx-4 rounded-full mb-2`}
					value={searchQuery}
					onChangeText={(text) => setSearchQuery(text)}
					size={"lg"}
				/>
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
												options?.showAssignees || false
											);
										}}
									/>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				))}

				{activeItem && (
					<ItemModal
						activeItem={activeItem}
						onDismiss={() => setActiveItem(null)}
						showAssigness={openAssignees}
					/>
				)}
			</Animated.ScrollView>
			<View
				style={[
					{
						position: "absolute",
						bottom: 16,
						right: 16,
						flexDirection: "column",
						// justifyContent: "flex-end",
						alignItems: "flex-end",
						gap: 16,
					},
				]}
			>
				<Animated.View style={animatedStyle}>
					<Button
						color={"accent"}
						variant={"flat"}
						className={`rounded-full`}
						size={"iconLarge"}
						onPress={() => searchInputRef.current?.focus()}
					>
						<RText>{ICONS.search(24, COLORS.accent.light)}</RText>
					</Button>
				</Animated.View>
				<Button size={"iconLarge"} className={`rounded-full`}>
					<RText>{ICONS.add(24, COLORS.secondary.foreground)}</RText>
				</Button>
			</View>
		</>
	);
};

export default SharedList;
