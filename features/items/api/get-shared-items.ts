import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { Item, ItemSchema } from '@/types/packingItem';
import { useQuery } from '@tanstack/react-query';

export const useGetSharedItems = (tripId: string) => {
    return useQuery<Item[]>({
        queryFn: async () => {
            const res = await api.request<{ items: Item[] }>(apiRoutes.trip.sharedItems(tripId));
            const i = ItemSchema.array().safeParse(res.data.items);
            if (!i.success) {
                throw new Error('Failed to parse shared items');
            }
            return i.data;
        },
        queryKey: KEYS.trip.sharedItems(tripId),
        enabled: !!tripId,
    })
}