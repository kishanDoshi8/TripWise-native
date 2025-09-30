import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { BText } from "@/components/ui/text";
import { ICONS } from "@/constants/icons";
import { useSendOtp } from "@/features/auth/api/send-otp";
import { accessCodeSchema, useVerifyOtp } from "@/features/auth/api/verify-otp";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/errorMessage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

export default function OtpScreen() {
	const { email } = useLocalSearchParams<{ email: string }>();
	const [accessCode, setAccessCode] = useState("");
	const { isPending, mutate } = useVerifyOtp();
	const { isPending: isResendPending, mutate: resendOtp } = useSendOtp();
	const navigation = useNavigation();
	const router = useRouter();
	const { showToast } = useToast();

	const [isValid, setIsValid] = useState(false);
	const [cooldown, setCooldown] = useState(0); // 0 means no cooldown

	const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!email) onGoBack();
	}, []);

	useEffect(() => {
		const valid = accessCodeSchema.safeParse(accessCode).success;
		setIsValid(valid);
	}, [accessCode]);

	const verifyOtp = () => {
		if (!email) return;
		mutate(
			{ email, accessCode },
			{
				onSuccess: () => {
					router.replace({ pathname: "/(app)" });
				},
				onError: (error) => {
					showToast({
						type: "error",
						title: getErrorMessage(error),
						timeout: 4000,
					});
				},
			}
		);
	};

	const onResendOtp = () => {
		if (!email || cooldown > 0) return;
		resendOtp(
			{ email },
			{
				onSuccess: (data) => {
					startCooldown();
					showToast({
						type: "success",
						title: data.message,
						timeout: 4000,
					});
				},
				onError: (error) => {
					showToast({
						type: "error",
						title: getErrorMessage(error),
						timeout: 4000,
					});
				},
			}
		);
	};

	const startCooldown = () => {
		setCooldown(30);
	};

	useEffect(() => {
		if (cooldown === 0) {
			if (cooldownRef.current) {
				clearInterval(cooldownRef.current);
				cooldownRef.current = null;
			}
			return;
		}

		cooldownRef.current = setInterval(() => {
			setCooldown((prev) => {
				if (prev <= 1 && cooldownRef.current) {
					clearInterval(cooldownRef.current);
					cooldownRef.current = null;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (cooldownRef.current) {
				clearInterval(cooldownRef.current);
			}
		};
	}, [cooldown]);

	const onGoBack = () => {
		if (navigation.canGoBack()) {
			navigation.goBack();
		} else {
			router.replace("/auth/email");
		}
	};

	return (
		<>
			<View className={`flex-row gap-4`}>
				<Input
					placeholder='4-digit access code'
					autoComplete='off'
					keyboardType='numeric'
					autoCapitalize='none'
					aria-labelledby='access code'
					clearButtonMode='unless-editing'
					value={accessCode}
					onChangeText={setAccessCode}
					wrapperClassName={`flex-1`}
					maxLength={4}
					returnKeyType='done'
					onSubmitEditing={verifyOtp}
				/>
				<Button
					size={"lg"}
					variant={"bordered"}
					disabled={isPending || cooldown > 0}
					onPress={onResendOtp}
					isLoading={isResendPending}
				>
					<BText>
						{cooldown > 0 ? `Resend (${cooldown})` : "Resend"}
					</BText>
				</Button>
			</View>
			<Button
				size={"lg"}
				disabled={!isValid}
				isLoading={isPending}
				onPress={verifyOtp}
			>
				<BText>Dive in</BText>
			</Button>
			<Button
				color={"secondary"}
				variant={"flat"}
				onPress={onGoBack}
				icon={ICONS.back()}
			>
				<BText>{email}</BText>
			</Button>
		</>
	);
}
