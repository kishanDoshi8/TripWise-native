import { COLORS } from "@/constants/colors";
import React from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
	children: React.ReactNode;
} & ViewProps;

export default function SafeArea({ children, ...props }: Readonly<Props>) {
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: COLORS.secondary.dark }}
			edges={["top"]}
		>
			<View {...props}>{children}</View>
		</SafeAreaView>
	);
}
