import { BText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useAuth } from "@/providers/AuthProvider";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

let hasRedirected = false;

export default function TabsLayout() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user?.lastTripId && !hasRedirected) {
			hasRedirected = true;
			router.push(`/trip/${user.lastTripId}`);
		}
	}, [user]);

	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: COLORS.secondary.dark,
					borderTopWidth: 0,
					height: 72,
					paddingTop: 8,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon icon={ICONS.home} focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name='invites'
				options={{
					title: "Invites",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<BText>
							{ICONS.invite(
								24,
								focused
									? COLORS.primary.light
									: COLORS.secondary.light
							)}
						</BText>
					),
				}}
			/>
			<Tabs.Screen
				name='completed'
				options={{
					title: "Completed",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<BText>
							{ICONS.recent(
								24,
								focused
									? COLORS.primary.light
									: COLORS.secondary.light
							)}
						</BText>
					),
				}}
			/>
			<Tabs.Screen
				name='more'
				options={{
					title: "More",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<BText>
							{ICONS.more(
								24,
								focused
									? COLORS.primary.light
									: COLORS.secondary.light
							)}
						</BText>
					),
				}}
			/>
		</Tabs>
	);
}

const TabBarIcon = ({
	icon,
	focused,
}: {
	icon: (size: number, color: string) => React.ReactNode;
	focused: boolean;
}) => (
	<BText>
		{icon(24, focused ? COLORS.primary.light : COLORS.secondary.light)}
	</BText>
);
