import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { Member } from "@/types/member";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import MemberAvatar from "./MemberAvatar";

type Props = {
	members: Member[];
};

export default function TripMemebers({ members }: Readonly<Props>) {
	const memberColors = useTripMemberColors();
	const displayedMembers = members.slice(0, 5);

	return (
		<View className={`bg-secondary-dark mt-4 gap-4`}>
			<Link href='/' asChild>
				<Pressable>
					{({ pressed }) => (
						<View
							className={`flex-row justify-between items-center w-full px-4 py-4`}
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
			<View className={`flex-row gap-2 mt-2 px-4 pb-8`}>
				{displayedMembers?.map((member, i) => (
					<MemberAvatar
						key={member.user.id}
						member={member}
						color={memberColors[member.user.id]}
					/>
				))}
				{members.length > displayedMembers.length && (
					<Avatar key={members.length} alt={`+${members.length - 4}`}>
						<AvatarFallback className={`bg-secondary-light`}>
							<BText size='xl' className='text-secondary-dark'>
								+{members.length - displayedMembers.length}
							</BText>
						</AvatarFallback>
					</Avatar>
				)}
			</View>
		</View>
	);
}
