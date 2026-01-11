import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { queryClient } from "@/config/queryClientConfig";
import { Checklist, ChecklistSchema } from "@/types/checklist";
import { useMutation } from "@tanstack/react-query";

type CreateChecklistType = {
    tripId: string;
    name: string;
};

const createChecklist = async ({ tripId, name }: CreateChecklistType): Promise<Checklist> => {
    // API call to create a checklist
    const res = await api.request<{ checklist: Checklist }>({
        url: apiRoutes.trip.createChecklist(tripId).url,
        method: apiRoutes.trip.createChecklist(tripId).method,
        data: { name, tripId },
    });
    return ChecklistSchema.parse(res.data.checklist);
}

export const useCreateChecklist = () => {
    return useMutation<Checklist, Error, CreateChecklistType, { previous?: Checklist[] }>({
        mutationFn: createChecklist,
        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({
                queryKey: ['trip', 'checklist', vars.tripId],
            });
        }
    });
}