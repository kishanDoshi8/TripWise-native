import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { KEYS } from "@/constants/queryKeys";
import { Trip, TripSchema } from "@/types/trip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const CreateTripSchema = z.object({
	name: z.string().min(1, "Trip name is required"),
	description: z.string().optional(),
	locationName: z.string().min(1, "Location is required"),
	startDate: z.coerce.date().min(1, "Start date is required"),
	endDate: z.coerce.date().min(1, "End date is required"),
});
export type CreateTrip = z.infer<typeof CreateTripSchema>;

const createTrip = async (tripData: CreateTrip): Promise<Trip> => {
	const res = await api.request<{ trip: Trip }>({
		url: apiRoutes.trip.createTrip().url,
		method: apiRoutes.trip.createTrip().method,
		data: tripData,
	});
	return TripSchema.parse(res.data.trip);
};

export const useCreateTrip = () => {
	const queryClient = useQueryClient();
	return useMutation<Trip, Error, CreateTrip>({
		mutationFn: createTrip,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: KEYS.trips.ALL });
		},
	});
};
