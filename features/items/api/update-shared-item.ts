import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { Item, ItemSchema } from '@/types/packingItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateItemType = {
    itemId: string;
    tripId: string;
    data: Partial<Item>;
};

const updateItem = async ({ itemId, data }: UpdateItemType): Promise<Item> => {
    const res = await api.request<{ item: Item }>({
        url: apiRoutes.trip.updateSharedItem(itemId).url,
        method: apiRoutes.trip.updateSharedItem(itemId).method,
        data
    });
    return ItemSchema.parse(res.data.item);
}

export const useUpdateSharedItem = () => {
    const queryClient = useQueryClient();

    return useMutation<Item, Error, UpdateItemType, { previous?: Item[] }>({
        mutationFn: updateItem,
        onMutate: async ({ itemId, tripId, data }) => {
        await queryClient.cancelQueries({ queryKey: KEYS.trip.sharedItems(tripId) });

        const previous = queryClient.getQueryData<Item[]>(KEYS.trip.sharedItems(tripId));

        queryClient.setQueryData(
            KEYS.trip.sharedItems(tripId),
            (old: Item[]) =>
            old
                ? old.map((i) =>
                    i.id === itemId
                    ? {
                        ...i,
                        ...data
                    }
                    : i
                )
                : old
        );

        return { previous };
        },

        onError: (_err, vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    KEYS.trip.sharedItems(vars.tripId),
                    context.previous
                );
            }
        },

        onSettled: (_data, _err, vars) => {
            queryClient.invalidateQueries({
                queryKey: KEYS.trip.sharedItems(vars.tripId)
            });
        }
    });
};
