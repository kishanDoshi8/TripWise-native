import { BText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useTripMemberColors } from "@/hooks/useTripMemberColors";
import { Member } from "@/types/member";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import MemberAvatar from "./MemberAvatar";

type Props = {
	members: Member[];
};

export default function TripMemebers({ members }: Readonly<Props>) {
	const memberColors = useTripMemberColors(members);

	return (
		<View className={`bg-secondary-dark mt-4 gap-4`}>
			<Link href='/' asChild>
				<Pressable>
					{({ pressed }) => (
						<View
							className={`flex-row justify-between items-center w-full px-8 py-4`}
							style={{
								backgroundColor: pressed
									? COLORS.secondary.DEFAULT
									: COLORS.secondary.dark,
							}}
						>
							<BText size='xl'>Members</BText>
							{ICONS.chevronRight(24, COLORS.secondary.light)}
						</View>
					)}
				</Pressable>
			</Link>
			<View className={`flex-row gap-2 mt-2 px-8 pb-8`}>
				{members?.map((member) => (
					<MemberAvatar
						key={member.user.id}
						member={member}
						color={memberColors[member.user.id]}
					/>
				))}
			</View>
		</View>
	);
}
