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
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { Item } from "@/types/packingItem";
import React from "react";
import { View } from "react-native";
import { useUpdateSharedItem } from "../api/update-shared-item";

type Props = {
	item: Item;
	setUpdateQuantityItem: (item: Item) => void;
	setUpdateAssigneeItem: (item: Item) => void;
};

export function ListItem({
	item,
	setUpdateQuantityItem,
	setUpdateAssigneeItem,
}: Readonly<Props>) {
	const memberColors = useTripMemberColors();
	const { mutate: updateItem } = useUpdateSharedItem();

	const handleQuantityUpdate = () => {
		setUpdateQuantityItem(item);
	};

	const handleAssigneeUpdate = () => {
		setUpdateAssigneeItem(item);
	};

	const toggleChecked = () => {
		const nextValue = !item.packedStatus;

		updateItem({
			itemId: item.id,
			tripId: item.tripId,
			data: { packedStatus: nextValue },
		});
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
							className='mt-[6px]'
						/>
						<View className={`flex-1`}>
							<View
								className={`gap-3 flex-row items-center justify-between`}
							>
								<RText className='text-lg'>{item.name}</RText>
								{item.quantity > 0 && (
									<Button
										variant={"flat"}
										color={"accent"}
										size={"icon"}
										onPress={handleQuantityUpdate}
									>
										<RText>{item.quantity}</RText>
									</Button>
								)}
							</View>
							{item.assignees && item.assignees.length > 0 && (
								<View className={`flex-row gap-3 flex-wrap`}>
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
							)}
						</View>
					</AccordionTrigger>
					<AccordionContent>
						<View className={`flex-row flex-wrap gap-4 ml-9`}>
							<Button
								variant={"bordered"}
								size={"sm"}
								onPress={handleAssigneeUpdate}
							>
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
