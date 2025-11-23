import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { Item, ItemSchema } from '@/types/packingItem';
import { useQuery } from '@tanstack/react-query';

export const useGetSharedItems = (tripId: string) => {
    return useQuery<Item[]>({
        queryFn: async () => {
            const res = await api.request<{ items: Item[] }>(apiRoutes.trip.sharedItems(tripId));
            return ItemSchema.array().parse(res.data.items);
        },
        queryKey: KEYS.trip.sharedItems(tripId),
        enabled: !!tripId,
    })
}