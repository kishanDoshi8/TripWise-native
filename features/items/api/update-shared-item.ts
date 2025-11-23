import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { Item, ItemSchema } from '@/types/packingItem';
import { useMutation } from '@tanstack/react-query';

type UpdateItem = {
    itemId: string;
    data: Partial<Item>;
};

const updateItem = async ({ itemId, data }: UpdateItem): Promise<Item> => {
    const res = await api.request<{ item: Item }>({
        url: apiRoutes.trip.updateSharedItem(itemId).url,
        method: apiRoutes.trip.updateSharedItem(itemId).method,
        data
    });
    return ItemSchema.parse(res.data.item);
}

export const useUpdateSharedItem = (itemId: string) => {
    return useMutation<Item, Error, UpdateItem>({
        mutationFn: updateItem,
    })
}