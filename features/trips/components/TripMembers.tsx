import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordian";
import { CopyButton } from "@/components/ui/copyButton";
import { Input } from "@/components/ui/Input";
import { RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useToast } from "@/hooks/useToast";
import { useTripMemberColors } from "@/providers/TripMemberColorsProvider";
import { Member } from "@/types/member";
import { getErrorMessage } from "@/utils/errorMessage";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useInviteMember } from "../api/invite-member";
import MemberAvatar from "./MemberAvatar";

type Props = {
	members: Member[];
};

export default function TripMembers({ members }: Readonly<Props>) {
	const { id: tripId } = useLocalSearchParams<{ id: string }>();
	const memberColors = useTripMemberColors();
	const { mutate: inviteMember, isPending: isInviting } = useInviteMember();
	const { showToast } = useToast();

	const [invite, setInvite] = React.useState<string>("");

	const handleInvite = () => {
		if (!invite.trim()) return;
		if (!tripId) return;

		inviteMember(
			{ email: invite.trim().toLowerCase(), tripId },
			{
				onSuccess: () => {
					showToast({
						type: "success",
						title: "Invite sent successfully!",
					});
					setInvite("");
				},
				onError: (error) => {
					showToast({
						type: "error",
						title: `Failed to send invite`,
						desc: getErrorMessage(error),
					});
				},
			},
		);
	};

	return (
		<View className={`bg-secondary-dark mt-4 gap-4`}>
			<Accordion
				type='single'
				collapsible
				className={`m-2 p-2`}
				defaultValue={["members"]}
			>
				<AccordionItem value='members'>
					<AccordionTrigger>
						<RText className={`text-xl font-medium`}>
							{members.length === 1
								? "1 Member"
								: `${members.length} Members`}
						</RText>
					</AccordionTrigger>
					<AccordionContent>
						<Input
							icon={ICONS.add(20, COLORS.secondary.light)}
							placeholder='Invite friends'
							className={`mt-4 mb-4 rounded-full`}
							size={"lg"}
							actionName={invite.trim() ? "Invite" : undefined}
							action={handleInvite}
							isActionLoading={isInviting}
							value={invite}
							onChangeText={setInvite}
							onSubmitEditing={handleInvite}
							returnKeyType='send'
						/>
						{members?.map((member, i) => (
							<View
								key={member.user.id}
								className={`flex-row items-center gap-2 mt-2 pb-8`}
							>
								<MemberAvatar
									member={member}
									color={memberColors[member.user.id]}
								/>
								<View className={`flex-1`}>
									<RText
										key={member.user.id}
										style={{
											color:
												member.status === "Accepted"
													? memberColors[
															member.user.id
														]
													: COLORS.secondary.light,
										}}
										className={`text-xl`}
									>
										{member.user.displayName}
									</RText>
									<View
										className={`flex-row gap-2 items-center`}
									>
										<RText
											className={`text-sm text-secondary-light`}
										>
											{member.user.email}
										</RText>
										<CopyButton
											iconSize={10}
											value={member.user.email}
										/>
									</View>
								</View>
								{member.status == "Invited" && (
									<View
										className={`flex-row gap-1 justify-center items-center`}
									>
										<RText
											className={`text-sm text-secondary-light`}
										>
											{ICONS.markEmailRead(
												14,
												COLORS.secondary.light,
											)}
										</RText>
										<RText
											className={`text-sm text-secondary-light`}
										>
											{member.status}
										</RText>
									</View>
								)}
								{member.role === "Organizer" &&
									member.status === "Accepted" && (
										<RText
											className={`bg-primary rounded-full px-2`}
										>
											Organizer
										</RText>
									)}
							</View>
						))}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</View>
	);
}
