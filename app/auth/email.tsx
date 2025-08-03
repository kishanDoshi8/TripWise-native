import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { BText } from "@/components/ui/text";
import { useSendOtp } from "@/features/auth/api/send-otp";
import { useToast } from "@/hooks/useToast";
import { emailSchema } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function EmailScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [isValid, setIsValid] = useState(false);
	const { isPending, mutate } = useSendOtp();
	const { showToast } = useToast();

	useEffect(() => {
		const valid = emailSchema.safeParse(email).success;
		setIsValid(valid);
	}, [email]);

	const sendOtp = () => {
		mutate(
			{ email },
			{
				onSuccess: (data) => {
					showToast({
						type: "success",
						title: data.message,
						timeout: 4000,
					});
					router.push({ pathname: "/auth/otp", params: { email } });
				},
				onError: (error) => {
					showToast({
						type: "error",
						title: "Error",
						desc: (error as Error).message,
					});
				},
			}
		);
	};

	return (
		<>
			<Input
				placeholder='Email'
				autoComplete='email'
				keyboardType='email-address'
				autoCapitalize='none'
				value={email}
				onChangeText={setEmail}
				aria-labelledby='email'
				clearButtonMode='unless-editing'
				returnKeyType='done'
				onSubmitEditing={sendOtp}
			/>
			<Button
				disabled={!isValid}
				onPress={sendOtp}
				isLoading={isPending}
				size={"lg"}
			>
				<BText>Login</BText>
			</Button>
		</>
	);
}
