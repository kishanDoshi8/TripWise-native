import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/axiosConfig';
import { KEYS } from '@/constants/queryKeys';
import { Trip, TripSchema } from '@/types/trip';
import { useQuery } from '@tanstack/react-query';

export const useGetTripDetails = (tripId: string) => {
    return useQuery<Trip>({
        queryFn: async () => {
            const res = await api.request<{ trip: Trip }>(apiRoutes.trip.details(tripId));
            return TripSchema.parse(res.data.trip);
        },
        queryKey: KEYS.trip.details(tripId),
        enabled: !!tripId,
    })
}