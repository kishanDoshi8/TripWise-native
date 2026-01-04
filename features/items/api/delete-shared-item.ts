import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { DeleteItem, DeleteItemSchema, Item } from '@/types/packingItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type DeleteItemType = {
    item: Item
};

const deleteItem = async ({ item }: DeleteItemType): Promise<DeleteItem> => {
    const res = await api.request<{ deletedItem: DeleteItem }>({
        url: apiRoutes.trip.deleteItem(item.id).url,
        method: apiRoutes.trip.deleteItem(item.id).method,
    });
    return DeleteItemSchema.parse(res.data.deletedItem);
}

export const useDeleteItem = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteItem, Error, DeleteItemType, { previous?: Item[] }>({
        mutationFn: deleteItem,
        onMutate: async ({ item }) => {
            await queryClient.cancelQueries({ queryKey: KEYS.trip.sharedItems(item.tripId) });

            const previous = queryClient.getQueryData<Item[]>(KEYS.trip.sharedItems(item.tripId));

            if (!item.isPersonal) {
                queryClient.setQueryData(
                    KEYS.trip.sharedItems(item.tripId),
                    (old: Item[]) => old.filter(i => i.id !== item.id)
                )
            }

            return { previous };
        },

        onError: (_err, vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    KEYS.trip.sharedItems(vars.item.tripId),
                    context.previous
                );
            }
        },

        onSettled: (_data, _err, vars) => {
            queryClient.invalidateQueries({
                queryKey: KEYS.trip.sharedItems(vars.item.tripId)
            });
        }
    });
};
