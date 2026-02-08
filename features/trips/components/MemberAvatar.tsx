import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { Member } from "@/types/member";
import React from "react";
import { ColorValue } from "react-native";

type Props = {
	member: Member;
	color: ColorValue;
};

export default function MemberAvatar({ member, color }: Readonly<Props>) {
	return (
		<Avatar key={member.user.id} alt={member.user.displayName}>
			<Fallback member={member} color={color} />
		</Avatar>
	);
}

// export default function MemberAvatar({ member, color }: Readonly<Props>) {
// 	return (
// 		<Popover>
// 			<PopoverTrigger asChild>
// 				<Button size={"icon"} className={`rounded-full`}>
// 					<Avatar key={member.user.id} alt={member.user.displayName}>
// 						<Fallback member={member} color={color} />
// 					</Avatar>
// 				</Button>
// 			</PopoverTrigger>

// 			<PopoverContent>
// 				<View className='flex justify-between items-start gap-2'>
// 					<Avatar alt='Vercel avatar'>
// 						<Fallback member={member} color={color} />
// 					</Avatar>
// 					<View>
// 						<View className={`flex-row`}>
// 							<BText size={"xl2"} className={`text-white`}>
// 								{member.user.displayName}
// 							</BText>
// 							<RText
// 								size={"xl2"}
// 								className={`text-secondary-light`}
// 							>
// 								#{member.user.tag}
// 							</RText>
// 						</View>
// 						<View
// 							style={{
// 								flexDirection: "row",
// 								alignItems: "center",
// 								gap: 6,
// 							}}
// 						>
// 							<RText size={"sm"}>{member.user.email}</RText>
// 							<CopyButton value={member.user.email} />
// 						</View>
// 						<View
// 							style={{
// 								flexDirection: "row",
// 								alignItems: "center",
// 								marginTop: 8,
// 								gap: 6,
// 							}}
// 						>
// 							{ICONS.role(12, COLORS.foreground)}
// 							<RText>{member.role}</RText>
// 						</View>
// 						<View
// 							style={{
// 								flexDirection: "row",
// 								alignItems: "center",
// 								gap: 6,
// 							}}
// 						>
// 							{ICONS.invite(12, COLORS.foreground)}
// 							<RText>{member.status}</RText>
// 						</View>
// 					</View>
// 				</View>
// 			</PopoverContent>
// 		</Popover>
// 	);
// }

const Fallback = ({ member, color }: Readonly<Props>) => {
	return (
		<AvatarFallback
			style={{
				backgroundColor:
					member.status === "Accepted"
						? color
						: COLORS.secondary.DEFAULT,
			}}
		>
			<BText
				className={`capitalize`}
				style={{
					color: member.status === "Accepted" ? "black" : "white",
				}}
			>
				{member.user.displayName.charAt(0)}
			</BText>
		</AvatarFallback>
	);
};
