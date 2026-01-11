import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useToast } from "@/hooks/useToast";
import {
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateChecklist } from "../api/create-checklist";
import { useGetChecklists } from "../api/get-checklists";

type Props = {
	checklistId: string | null;
	setChecklistId: (id: string | null) => void;
	modalRef: React.RefObject<BottomSheetModal | null>;
};

const ItemChecklistModal = ({
	checklistId,
	setChecklistId,
	modalRef,
}: Props) => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: checklists } = useGetChecklists(id);
	const { mutate: createChecklist, isPending } = useCreateChecklist();
	const insets = useSafeAreaInsets();
	const { showToast } = useToast();

	const [newChecklistName, setNewChecklistName] = React.useState<string>("");

	useEffect(() => {
		modalRef.current?.dismiss();
	}, [checklistId]);

	const onAddChecklist = () => {
		createChecklist(
			{ tripId: id, name: newChecklistName.trim() },
			{
				onSuccess: (data) => {
					setChecklistId(data.id);
					setNewChecklistName("");
					modalRef.current?.dismiss();
				},
				onError: (error) => {
					showToast({
						type: "error",
						title: "Error",
						desc: error.message || "Failed to create checklist.",
					});
				},
			}
		);
	};

	const renderHandle = React.useCallback(() => {
		return (
			<View className={`flex-row items-center justify-between p-4`}>
				<Button
					onPress={() => modalRef.current?.dismiss()}
					variant='ghost'
					size={"icon"}
					color='secondary'
					className={`mt-1`}
					icon={ICONS.chevronDown(32)}
				></Button>
				<RText variant={"muted"} size={"xl"} className='font-medium'>
					Move to
				</RText>
				<Button
					onPress={() => modalRef.current?.dismiss()}
					variant='ghost'
					size={"icon"}
					color='secondary'
					className={`mt-1 opacity-0`}
					icon={ICONS.chevronDown(32)}
				></Button>
			</View>
		);
	}, []);

	return (
		<BottomModal
			ref={modalRef}
			snapPoints={["100%"]}
			index={0}
			enablePanDownToClose={true}
			enableDismissOnClose={true}
			bottomInset={insets.bottom}
			topInset={insets.top}
			keyboardBehavior='fillParent'
			enableDynamicSizing
			handleComponent={renderHandle}
		>
			<BottomSheetView>
				<BottomSheetScrollView
					contentContainerStyle={{
						paddingVertical: 20,
					}}
				>
					<Animated.View>
						<BottomSheetTextInput
							placeholder='Search'
							style={{
								color: "white",
								fontFamily: "UbuntuMono_400Regular",
							}}
							placeholderTextColor={"#94a3b8"}
							className={`m-4 p-4 border-2 border-secondary rounded-lg`}
						/>
						<View
							className={`mx-4 px-4 py-2 rounded-lg bg-secondary-dark`}
						>
							<Pressable
								className={`py-2 flex-row items-center gap-2`}
								onPress={() => {
									setChecklistId(null);
								}}
							>
								<RText>
									{ICONS.listAlt(
										20,
										checklistId === null
											? COLORS.accent.DEFAULT
											: undefined
									)}
								</RText>
								<RText
									size='xl2'
									className={`${
										checklistId === null && "text-accent"
									}`}
								>
									Shared List
								</RText>
							</Pressable>
							{checklists?.map((checklist) => (
								<Pressable
									key={checklist.id}
									className={`py-2 flex-row items-center gap-2 ${
										checklistId === checklist.id
											? "text-accent"
											: ""
									}`}
									onPress={() => {
										setChecklistId(checklist.id);
									}}
								>
									<RText>
										{ICONS.listAlt(
											20,
											checklistId === checklist.id
												? COLORS.accent.DEFAULT
												: undefined
										)}
									</RText>
									<RText
										size='xl2'
										className={`${
											checklistId === checklist.id &&
											"text-accent"
										}`}
									>
										{checklist.name}
									</RText>
								</Pressable>
							))}
						</View>
						<View
							className={`m-4 flex-row items-center justify-center gap-4`}
						>
							<BottomSheetTextInput
								placeholder='Add new'
								style={{
									color: "white",
									fontFamily: "UbuntuMono_400Regular",
								}}
								placeholderTextColor={"#94a3b8"}
								className={`p-4 border-none outline-none focus:border-2 focus:border-accent rounded-lg flex-1`}
								value={newChecklistName}
								onChangeText={setNewChecklistName}
							/>
							<Button
								disabled={newChecklistName.trim().length < 3}
								onPress={onAddChecklist}
								className={`w-24`}
								size={"lg"}
								isLoading={isPending}
								icon={ICONS.add(20)}
							>
								<RText>Add</RText>
							</Button>
						</View>
					</Animated.View>
				</BottomSheetScrollView>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ItemChecklistModal;
