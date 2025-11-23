import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import Spinner from "@/components/ui/Spinner";
import { BText } from "@/components/ui/text";
import { Item } from "@/types/packingItem";
import React from "react";
import { View } from "react-native";
import { ListItem } from "./ListItem";

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
									<ListItem key={item.id} item={item} />
								))}
							</View>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</View>
	);
}
