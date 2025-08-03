import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { KEYS } from "@/constants/queryKeys";
import { Trip, TripSchema } from "@/types/trip";
import { useQuery } from '@tanstack/react-query';

const getTrips = async (): Promise<Trip[]> => {
    const { url, method } = apiRoutes.trip.invites;
    const response = await api.request<{ trips: Trip[] }>({ url, method });
    return TripSchema.array().parse(response.data.trips);
}

export const useGetTripInvites = () => {
    return useQuery({
        queryKey: KEYS.trips.invites,
        queryFn: getTrips,
    });
}