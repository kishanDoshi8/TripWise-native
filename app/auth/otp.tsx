import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtpScreen() {
	const { email } = useLocalSearchParams();
	const [otp, setOtp] = useState("");

	const verifyOtp = () => {};

	return (
		<SafeAreaView style={{ padding: 20 }}>
			<Text>Enter OTP sent to {email}:</Text>
			<TextInput
				value={otp}
				onChangeText={setOtp}
				keyboardType='numeric'
			/>
			<Button title='Verify OTP' onPress={verifyOtp} />
		</SafeAreaView>
	);
}
