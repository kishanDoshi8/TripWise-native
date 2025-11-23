import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { KEYS } from "@/constants/queryKeys";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { Item } from "@/types/packingItem";
import { useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
import { useUpdateSharedItem } from "../api/update-shared-item";

export function ListItem({ item }: Readonly<{ item: Item }>) {
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
