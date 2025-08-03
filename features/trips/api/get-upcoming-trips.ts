import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { KEYS } from "@/constants/queryKeys";
import { Trip, TripSchema } from "@/types/trip";
import { useQuery } from '@tanstack/react-query';

const getTrips = async (): Promise<Trip[]> => {
    const { url, method } = apiRoutes.trip.upcoming;
    const response = await api.request<{ trips: Trip[] }>({ url, method });
    return TripSchema.array().parse(response.data.trips);
}

export const useGetUpcomingTrips = () => {
    return useQuery({
        queryKey: KEYS.trips.upcoming,
        queryFn: getTrips,
    });
}