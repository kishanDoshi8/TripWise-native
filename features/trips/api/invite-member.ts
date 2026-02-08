import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { KEYS } from "@/constants/queryKeys";
import { Member } from "@/types/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type InviteMemberParams = {
	email: string;
	tripId: string;
};

const sendInvite = async ({
	email,
	tripId,
}: InviteMemberParams): Promise<Member[]> => {
	const res = await api.request<{ members: Member[] }>({
		url: apiRoutes.trip.inviteMember(tripId).url,
		method: apiRoutes.trip.inviteMember(tripId).method,
		data: { email },
	});
	return res.data.members;
};

export const useInviteMember = () => {
	const queryClient = useQueryClient();
	return useMutation<Member[], Error, InviteMemberParams>({
		mutationFn: sendInvite,
		onSuccess: (members, variables) => {
			queryClient.setQueryData<Member[]>(
				KEYS.trip.members(variables.tripId),
				() => members,
			);
		},
	});
};
