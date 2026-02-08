import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useToast } from "@/hooks/useToast";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { Item } from "@/types/packingItem";
import { getErrorMessage } from "@/utils/errorMessage";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useAddItem } from "../api/add-item";
import { useUpdateSharedItem } from "../api/update-shared-item";
import { ItemModalOptions } from "./SharedList";

type Props = {
	item: Item;
	onPress: (options?: ItemModalOptions) => void;
};

const ListItem = ({ item, onPress }: Readonly<Props>) => {
	const { mutate: updateItem, error: updateError } = useUpdateSharedItem();
	const { mutate: addItem, error: addError } = useAddItem();
	const { showToast } = useToast();
	const memberColors = useTripMemberColors();

	const showMembersLength = 3;

	useEffect(() => {
		if (updateError) {
			showToast({
				type: "error",
				title: "Error updating item",
				desc: getErrorMessage(updateError),
			});
		} else if (addError) {
			showToast({
				type: "error",
				title: "Error adding item",
				desc: getErrorMessage(addError),
			});
		}
	}, [updateError, addError]);

	const toggleChecked = () => {
		const nextValue = !item.packedStatus;

		updateItem({
			itemId: item.id,
			tripId: item.tripId,
			data: { packedStatus: nextValue },
		});
	};

	const handleRetryAdd = () => {
		addItem({
			...item,
			tempId: item.id,
		});
	};

	return (
		<View className={`flex-row gap-3 py-3`}>
			{(() => {
				if (item.__error) {
					return (
						<Pressable onPress={handleRetryAdd}>
							{ICONS.errorOutline(20, COLORS.danger.DEFAULT)}
						</Pressable>
					);
				} else if (item.__optimistic) {
					return (
						<ActivityIndicator
							size='small'
							className={`self-start mt-[2px]`}
							color={COLORS.primary.DEFAULT}
						/>
					);
				} else {
					return (
						<Checkbox
							id={item.id}
							checked={item.packedStatus}
							onCheckedChange={toggleChecked}
							className='mt-[2px]'
						/>
					);
				}
			})()}

			<Pressable onPress={() => onPress()} className={`flex-1 gap-1`}>
				<View className={`gap-3 flex-row justify-between`}>
					<RText className='py-1 mt-[1px] text-md'>{item.name}</RText>
					{item.quantity > 1 && (
						<Button
							className={`self-end`}
							variant={"flat"}
							color={"accent"}
							size={"iconSmall"}
							onPress={() => onPress()}
						>
							<RText>{item.quantity}</RText>
						</Button>
					)}
				</View>
				{item.assignees && item.assignees.length > 0 && (
					<View className={`flex-row gap-3 flex-wrap`}>
						{item.assignees?.map(
							(assignee, i) =>
								i < showMembersLength - 1 && (
									<Pressable
										onPress={() =>
											onPress({ showAssignees: true })
										}
										key={assignee.id}
										className={`text-sm items-center justify-center rounded-full py-1 px-[10px] w-min`}
										style={{
											backgroundColor:
												memberColors[assignee.id] +
												"33", // 33 for 20% opacity
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
									</Pressable>
								),
						)}
						{item.assignees.length > showMembersLength - 1 && (
							<Button
								className={`rounded-full`}
								variant={"bordered"}
								color={"secondary"}
								size={"iconSmall"}
								onPress={() => onPress({ showAssignees: true })}
							>
								<RText>
									{item.assignees.length -
										(showMembersLength - 1)}
								</RText>
							</Button>
						)}
					</View>
				)}
			</Pressable>
		</View>
	);
};

export default ListItem;
