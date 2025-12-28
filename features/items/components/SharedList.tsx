import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import Spinner from "@/components/ui/Spinner";
import { BText } from "@/components/ui/text";
import { Item } from "@/types/packingItem";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { ListItem } from "./ListItem";
import { UpdateAssignees } from "./UpdateAssignees";
import UpdateQuantity from "./UpdateQuantity";

type Props = {
	items: Item[];
	isLoading: boolean;
};

export default function SharedList({ items, isLoading }: Readonly<Props>) {
	const [updateQuantityItem, setUpdateQuantityItem] = useState<Item | null>(
		null
	);

	const [updateAssigneeItem, setUpdateAssigneeItem] = useState<Item | null>(
		null
	);

	const onCloseSheet = () => {
		setUpdateQuantityItem(null);
		setUpdateAssigneeItem(null);
	};

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
								<FlatList
									data={items}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => (
										<ListItem
											key={item.id}
											item={item}
											setUpdateQuantityItem={
												setUpdateQuantityItem
											}
											setUpdateAssigneeItem={
												setUpdateAssigneeItem
											}
										/>
									)}
								/>
								{/* {items.map((item) => (
									<ListItem
										key={item.id}
										item={item}
										setUpdateQuantityItem={
											setUpdateQuantityItem
										}
										setUpdateAssigneeItem={
											setUpdateAssigneeItem
										}
									/>
								))} */}
							</View>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{updateQuantityItem && (
				<UpdateQuantity
					item={updateQuantityItem}
					onDismiss={onCloseSheet}
				/>
			)}

			{updateAssigneeItem && (
				<UpdateAssignees
					item={updateAssigneeItem}
					onDismiss={onCloseSheet}
				/>
			)}
		</View>
	);
}
