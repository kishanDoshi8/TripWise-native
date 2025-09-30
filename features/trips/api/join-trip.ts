import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const joinTrip = async (tripId: string) => {
    const res = await api.request<{ tripId: string }>(apiRoutes.trip.joinTrip(tripId));
    return res.data.tripId;
}

export const useJoinTrip = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: joinTrip,
        onSuccess: (tripId: string) => {
            queryClient.invalidateQueries({ queryKey: KEYS.trips.ALL });
        }
    })
}