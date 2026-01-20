import BottomModal from "@/components/ui/bottomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import SafeArea from "@/components/ui/safeArea";
import { BText, RText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useCreateTrip } from "@/features/trips/api/create-trip";
import { useToast } from "@/hooks/useToast";
import { Trip } from "@/types/trip";
import { getDuration, getRange } from "@/utils/dateFormatter";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";

const NewTrip = () => {
	const dateRangeBottomRef = React.useRef<BottomSheetModal>(null);
	const { showToast } = useToast();

	const { mutate: createTrip, isPending: isCreatingTrip } = useCreateTrip();

	const [location, setLocation] = React.useState<string>("");
	const [startDate, setStartDate] = React.useState<string>(
		new Date().toISOString().split("T")[0],
	);
	const [endDate, setEndDate] = React.useState<string>(
		new Date().toISOString().split("T")[0],
	);

	const handleDateRange = () => {
		dateRangeBottomRef.current?.present();
	};

	const handleSelectDate = (day: DateData) => {
		if (!startDate || (startDate && endDate)) {
			setStartDate(day.dateString);
			setEndDate("");
		} else if (startDate && !endDate) {
			if (day.dateString < startDate) {
				setEndDate(startDate);
				setStartDate(day.dateString);
			} else {
				setEndDate(day.dateString);
			}
		}
	};

	const getDatesInRange = (start: string, end: string) => {
		const dates: Record<string, any> = {};

		if (!start) return dates;

		const startDate = new Date(start);
		const endDate = end ? new Date(end) : startDate;

		let current = new Date(startDate);

		while (current <= endDate) {
			const dateString = current.toISOString().split("T")[0];

			dates[dateString] = {
				color: COLORS.accent.DEFAULT,
				textColor: COLORS.foreground,
			};

			current.setDate(current.getDate() + 1);
		}

		// Override start & end styling
		dates[start] = {
			startingDay: true,
			color: COLORS.accent.DEFAULT,
			textColor: COLORS.foreground,
		};

		if (end) {
			dates[end] = {
				endingDay: true,
				color: COLORS.accent.DEFAULT,
				textColor: COLORS.foreground,
			};
		}

		return dates;
	};

	const duration = getDuration(
		new Date(startDate),
		new Date(endDate || startDate),
	);

	const handleCreateTrip = () => {
		if (!location.trim()) {
			showToast({
				type: "error",
				title: "Please enter your trip destination.",
			});
			return;
		}
		if (!startDate) {
			showToast({
				type: "error",
				title: "Please select a start date for your trip.",
			});
			return;
		}

		createTrip(
			{
				locationName: location,
				startDate: new Date(startDate),
				endDate: new Date(endDate || startDate),
				name: "Trip to " + location,
			},
			{
				onSuccess: (trip: Trip) => {
					router.replace(`/(app)/trips/${trip.id}/(tabs)`);
				},
				onError: (error) => {
					showToast({
						type: "error",
						title: `Failed to create trip: ${error.message}`,
					});
				},
			},
		);
	};

	return (
		<SafeArea>
			<ScrollView>
				<View
					className={`bg-background py-8 px-4 z-50 flex-row items-center justify-between`}
				>
					<Button
						icon={ICONS.home()}
						size={"iconMedium"}
						className={`rounded-full`}
						variant={"flat"}
						color={"secondary"}
						onPress={() => router.back()}
					/>
					<View className={`m-auto`}>
						<BText className='text-2xl'>New Adventure</BText>
					</View>
					<Button
						className={`opacity-0`}
						icon={ICONS.home()}
						size={"iconMedium"}
						variant={"flat"}
						color={"secondary"}
					/>
				</View>
				<View className={`px-4 gap-4`}>
					<RText
						size='xl'
						className={`px-8 py-4 text-center text-secondary-light`}
					>
						Let’s get started by naming your trip and setting the
						dates.
					</RText>
					<Input
						placeholder='Where to?'
						value={location}
						onChangeText={setLocation}
					/>
					<View>
						<Button
							onPress={handleDateRange}
							color={"secondary"}
							variant='bordered'
							className={`border-2`}
							fullWidth
						>
							<RText>
								{duration == 1
									? "Single-day trip"
									: `${duration} days away from responsibility`}
							</RText>
						</Button>
						<Pressable onPress={handleDateRange}>
							<RText
								className='mt-2 text-center text-secondary-light'
								size={"sm"}
							>
								{getRange(
									new Date(startDate),
									new Date(endDate || startDate),
								)}
							</RText>
						</Pressable>
					</View>
				</View>
			</ScrollView>
			<Button
				className={`absolute bottom-12 right-12 left-12`}
				onPress={handleCreateTrip}
				disabled={isCreatingTrip}
				variant='solid'
				color='primary'
				size='lg'
				isLoading={isCreatingTrip}
			>
				<RText>Create Trip</RText>
			</Button>

			<BottomModal
				ref={dateRangeBottomRef}
				snapPoints={["50%", "100%"]}
				index={1}
				enableContentPanningGesture={true}
				enableHandlePanningGesture={true}
				enablePanDownToClose={true}
				enableDismissOnClose={true}
			>
				<BottomSheetView>
					<RText className='p-4 text-center'>
						{duration == 1
							? "Single-day trip"
							: `${duration} days away from responsibility`}
					</RText>

					<Calendar
						onDayPress={handleSelectDate}
						minDate={new Date().toISOString().split("T")[0]}
						enableSwipeMonths={true}
						markingType='period'
						markedDates={getDatesInRange(startDate, endDate)}
						initialDate={startDate}
						theme={{
							backgroundColor: COLORS.background,
							calendarBackground: COLORS.background,
							textSectionTitleColor: COLORS.foreground,
							textDisabledColor: COLORS.secondary.DEFAULT,
							dayTextColor: COLORS.foreground,
							selectedDayBackgroundColor: COLORS.secondary.light,
							selectedDayTextColor: COLORS.background,
							todayTextColor: COLORS.primary.light,
							monthTextColor: COLORS.foreground,
							arrowColor: COLORS.accent.DEFAULT,
						}}
					/>
				</BottomSheetView>
			</BottomModal>
		</SafeArea>
	);
};

export default NewTrip;
