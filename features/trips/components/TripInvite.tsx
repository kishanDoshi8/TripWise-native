import { Button } from "@/components/ui/button";
import { BText } from "@/components/ui/text";
import { ICONS } from "@/constants/icons";
import { useToast } from "@/hooks/useToast";
import { Trip } from "@/types/trip";
import { getErrorMessage } from "@/utils/errorMessage";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useDeclineTrip } from "../api/decline-trip";
import { useJoinTrip } from "../api/join-trip";
import TripCard from "./TripCard";

type Props = {
	trip: Trip;
};

export default function TripInvite({ trip }: Readonly<Props>) {
	const { isPending: isJoiningTrip, mutate: joinTrip } = useJoinTrip();
	const { isPending: isDecliningTrip, mutate: declineTrip } =
		useDeclineTrip();

	const router = useRouter();
	const { showToast } = useToast();

	const onJoinTrip = () => {
		joinTrip(trip.id, {
			onSuccess: (tripId: string) => {
				router.push(`/(app)/trips`);
				// router.push(`/(app)/trip/${tripId}`);
			},
			onError: (error) => {
				showToast({
					type: "error",
					title: "Error joining trip",
					desc: getErrorMessage(error),
				});
			},
		});
	};

	const onDeclineTrip = () => {
		declineTrip(trip.id, {
			onSuccess: () => {},
			onError: (error) => {
				showToast({
					type: "error",
					title: "Error joining trip",
					desc: getErrorMessage(error),
				});
			},
		});
	};

	return (
		<View className={`bg-red-400`}>
			<TripCard
				trip={trip}
				styles={{ borderStartEndRadius: 0, borderEndEndRadius: 0 }}
			/>
			<View className={`flex-row`}>
				<Button
					variant={"flat"}
					style={{
						borderEndStartRadius: 0,
						borderStartStartRadius: 0,
						borderEndEndRadius: 0,
						borderStartEndRadius: 24,
						flex: 1,
					}}
					icon={ICONS.check()}
					isLoading={isJoiningTrip}
					onPress={onJoinTrip}
				>
					<BText>Join</BText>
				</Button>
				<Button
					color={"danger"}
					variant={"flat"}
					style={{
						borderEndStartRadius: 0,
						borderStartStartRadius: 0,
						borderEndEndRadius: 24,
						borderStartEndRadius: 0,
						flex: 1,
					}}
					icon={ICONS.close()}
					isLoading={isDecliningTrip}
					onPress={onDeclineTrip}
				>
					<BText>Decline</BText>
				</Button>
			</View>
		</View>
	);
}
