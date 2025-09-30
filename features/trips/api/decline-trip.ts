import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const declineTrip = async (tripId: string) => {
    const res = await api.request<{ tripId: string }>(apiRoutes.trip.declineTrip(tripId));
    return res.data.tripId;
}

export const useDeclineTrip = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: declineTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.trips.invites });
        }
    })
}