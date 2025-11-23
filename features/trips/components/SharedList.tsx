import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/ui/Spinner";
import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { KEYS } from "@/constants/queryKeys";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { Item } from "@/types/packingItem";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { useUpdateSharedItem } from "../api/update-shared-item";

type Props = {
	items: Item[];
	isLoading: boolean;
};

export default function SharedList({ items, isLoading }: Readonly<Props>) {
	return (
		<View className={`p-4 bg-secondary-dark mt-8`}>
			<Accordion type='single' collapsible defaultValue={"item-1"}>
				<AccordionItem value='item-1'>
					<AccordionTrigger>
						<BText size='xl'>Shared List</BText>
					</AccordionTrigger>
					<AccordionContent>
						{isLoading ? (
							<Spinner />
						) : (
							<View>
								{items.map((item) => (
									<SharedItem key={item.id} item={item} />
								))}
							</View>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</View>
	);
}

function SharedItem({ item }: Readonly<{ item: Item }>) {
	const memberColors = useTripMemberColors();
	const { mutate: updateItem } = useUpdateSharedItem(item.id);
	const queryClient = useQueryClient();

	const toggleChecked = () => {
		const nextValue = !item.packedStatus;

		const updatedItem = {
			...item,
			packedStatus: nextValue,
		};

		updateItem({
			itemId: item.id,
			data: { packedStatus: nextValue },
		});

		queryClient.setQueryData(
			KEYS.trip.sharedItems(item.tripId),
			(prev: Item[]) => {
				if (!prev) return prev;
				return prev.map((i) => {
					return i.id === item.id ? updatedItem : i;
				});
			}
		);
	};

	return (
		<View>
			<Accordion type='single' collapsible>
				<AccordionItem value={item.id}>
					<AccordionTrigger
						className={`flex-row gap-3`}
						showIcon={false}
					>
						<Checkbox
							id={item.id}
							checked={item.packedStatus}
							onCheckedChange={toggleChecked}
							className='mt-[2px]'
						/>
						<View className={`flex-1`}>
							<View
								className={`gap-3 flex-row items-center justify-between`}
							>
								<RText className='text-lg'>{item.name}</RText>
								{item.quantity > 0 && (
									<RText className='text-xl bg-secondary px-3 rounded-md'>
										{item.quantity}
									</RText>
								)}
							</View>
							<View className={`flex-row gap-3 mt-2 flex-wrap`}>
								{item.assignees?.map(
									(assignee, i) =>
										i < 3 && (
											<View
												key={assignee.id}
												className={`text-sm items-center justify-center rounded-full py-1 px-[10px] w-min`}
												style={{
													backgroundColor:
														memberColors[
															assignee.id
														] + "33", // 33 for 20% opacity
												}}
											>
												<RText
													className='text-sm'
													style={{
														color: memberColors[
															assignee.id
														],
													}}
												>
													{assignee.displayName}
												</RText>
											</View>
										)
								)}
								{/* <Button
									size='iconSmall'
									variant={"bordered"}
									color={"secondary"}
									className='rounded-full'
								>
									{ICONS.add(14, COLORS.secondary.DEFAULT)}
								</Button> */}
							</View>
						</View>
					</AccordionTrigger>
					<AccordionContent>
						<View className={`flex-row flex-wrap gap-4 ml-9`}>
							<Button variant={"bordered"} size={"sm"}>
								<RText className='text-sm'>Assign</RText>
							</Button>
							<Button variant={"bordered"} size={"sm"}>
								<RText className='text-sm'>$$</RText>
							</Button>
							<Button variant={"bordered"} size={"sm"}>
								<RText className='text-sm'>
									{ICONS.notes(14, COLORS.primary.DEFAULT)}
								</RText>
							</Button>
							<Button
								variant={"bordered"}
								color={"danger"}
								size={"iconSmall"}
								className={`ml-auto`}
							>
								<RText className='text-sm'>
									{ICONS.delete(14, COLORS.danger.DEFAULT)}
								</RText>
							</Button>
						</View>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</View>
	);
}
