import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { KEYS } from "@/constants/queryKeys";
import { Item, ItemSchema } from "@/types/packingItem";
import { getErrorMessage } from "@/utils/errorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddItemParams = Partial<Item> & {
	tripId: string;
	name: string;
	tempId?: string;
};

const addItem = async (item: AddItemParams) => {
	const response = await api.request<{ item: Item }>({
		method: apiRoutes.trip.addItem().method,
		url: apiRoutes.trip.addItem().url,
		data: item,
	});

	return ItemSchema.parse(response.data.item);
};

export const useAddItem = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Item,
		Error,
		AddItemParams,
		{ previous?: Item[]; tempId?: string }
	>({
		mutationFn: addItem,
		onMutate: async (newItem) => {
			const tempId =
				newItem.tempId ?? "temp-" + Math.random().toString(36);
			await queryClient.cancelQueries({
				queryKey: KEYS.trip.sharedItems(newItem.tripId),
			});

			const previous = queryClient.getQueryData<Item[]>(
				KEYS.trip.sharedItems(newItem.tripId),
			);

			queryClient.setQueryData(
				KEYS.trip.sharedItems(newItem.tripId),
				(old: Item[]) => {
					// RETRY: update existing item
					if (newItem.tempId) {
						return old.map((item) =>
							item.id === newItem.tempId
								? {
										...item,
										__optimistic: true,
										__error: undefined,
									}
								: item,
						);
					}

					// FIRST ADD
					return [
						...old,
						{
							...newItem,
							id: tempId,
							__optimistic: true,
						},
					];
				},
			);

			return { previous, tempId };
		},
		onError: (err, newItem, context) => {
			queryClient.setQueryData<Item[]>(
				KEYS.trip.sharedItems(newItem.tripId),
				(old = []) =>
					old.map((item) =>
						item.id === context?.tempId
							? {
									...item,
									__optimistic: false,
									__error: getErrorMessage(err),
								}
							: item,
					),
			);
		},
		onSuccess: (serverItem, _vars, context) => {
			queryClient.setQueryData<Item[]>(
				KEYS.trip.sharedItems(serverItem.tripId),
				(old = []) =>
					old.map((item) =>
						item.id === context?.tempId ? serverItem : item,
					),
			);
		},
	});
};
