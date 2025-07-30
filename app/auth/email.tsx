import CText from "@/components/typography/customText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { ICONS } from "@/constants/icons";
import { useSendOtp } from "@/features/auth/api/send-otp";
import { useKeyboardOffset } from "@/hooks/useKeyboardOffset";
import { emailSchema } from "@/types";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmailScreen() {
	const [email, setEmail] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { isPending, mutate } = useSendOtp();

	useEffect(() => {
		const valid = emailSchema.safeParse(email).success;
		setIsValid(valid);
	}, [email]);

	const animatedStyles = useKeyboardOffset();

	const sendOtp = () => {
		mutate({ email });
	};

	return (
		<SafeAreaView className='h-full w-full'>
			<Animated.View
				style={[animatedStyles]}
				className={`justify-around flex-1`}
			>
				<View className={`flex-row justify-center items-center gap-2`}>
					{ICONS.logo(32)}
					<CText className={`text-white text-4xl`}>TripWise</CText>
				</View>
				<View className={`mx-8 gap-4`}>
					<Input
						placeholder='Email'
						autoComplete='email'
						autoCapitalize='none'
						value={email}
						onChangeText={setEmail}
						aria-labelledby='email'
						clearButtonMode='unless-editing'
					/>
					<Button
						size={"lg"}
						disabled={!isValid}
						onPress={sendOtp}
						isLoading={isPending}
					>
						<Text>Send OTP</Text>
					</Button>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
}
