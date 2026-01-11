import { apiRoutes } from "@/config/apiRoutes"
import api from "@/config/axiosConfig"
import { KEYS } from "@/constants/queryKeys"
import { Checklist, ChecklistSchema } from "@/types/checklist"
import { useQuery } from "@tanstack/react-query"


export const useGetChecklists = (tripId: string) => {
    return useQuery<Checklist[]>({
        queryKey: KEYS.trip.checklist(tripId),
        queryFn: async () => {
            const res = await api.request<{ checklists: Checklist[] }>(apiRoutes.trip.checklists(tripId));
            const response = ChecklistSchema.array().safeParse(res.data.checklists);

            if (!response.success) {
                throw new Error('Failed to parse checklists. E:', response.error);
            }

            return response.data;
        },
        enabled: !!tripId,
    })
}