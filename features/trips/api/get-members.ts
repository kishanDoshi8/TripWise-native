import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { Member, memberSchema } from '@/types/member';
import { useQuery } from '@tanstack/react-query';

export const useGetTripMembers = (tripId: string) => {
    return useQuery<Member[]>({
        queryFn: async () => {
            const res = await api.request<{ members: Member[] }>(apiRoutes.trip.members(tripId));
            return memberSchema.array().parse(res.data.members);
        },
        queryKey: KEYS.trip.members(tripId),
        enabled: !!tripId,
    })
}