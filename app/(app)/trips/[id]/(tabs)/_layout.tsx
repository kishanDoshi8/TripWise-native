import { BText } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getItem } from "@/utils/asyncStore";
import { router, Tabs, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
	const { id }: { id: string } = useLocalSearchParams();
	const insets = useSafeAreaInsets();

	const tabs = ["index", "shared", "expense", "profile"] as const;
	const TAB_ROUTES = {
		index: "/(app)/trips/[id]/(tabs)",
		shared: "/(app)/trips/[id]/(tabs)/shared",
		expense: "/(app)/trips/[id]/(tabs)/expense",
		profile: "/(app)/trips/[id]/(tabs)/profile",
	} as const;

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const lastTab = await getItem<(typeof tabs)[number]>(
				STORAGE_KEYS.UI.SELECTED_TAB,
			);

			if (cancelled || !lastTab || lastTab === "index") return;

			const pathname = TAB_ROUTES[lastTab];

			router.replace({
				pathname,
				params: { id },
			});
		})();

		return () => {
			cancelled = true;
		};
	}, [id]);

	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: COLORS.secondary.dark,
					borderTopWidth: 0,
					boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.3)",
					borderColor: COLORS.background,
					height: 72,
					paddingTop: 8,
					paddingBottom: insets.bottom + 32 || 16,
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
				name='shared'
				options={{
					title: "Invites",
					href: {
						pathname: `/trips/[id]/shared`,
						params: { id },
					},
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon icon={ICONS.groups} focused={focused} />
					),

					tabBarStyle: {
						backgroundColor: COLORS.secondary.dark,
						borderTopWidth: 0,
						// boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.3)",
						// borderColor: COLORS.background,
						height: 72,
						paddingTop: 8,
						paddingBottom: insets.bottom + 32 || 16,
					},
				}}
			/>
			{/* <Tabs.Screen
				name='personal'
				options={{
					title: "Personal",
					href: {
						pathname: `/trips/[id]/personal`,
						params: { id },
					},
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon icon={ICONS.list} focused={focused} />
					),
				}}
			/> */}
			<Tabs.Screen
				name='expense'
				options={{
					title: "Expenses",
					href: {
						pathname: `/trips/[id]/expense`,
						params: { id },
					},
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon icon={ICONS.money} focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: "Profile",
					href: {
						pathname: `/trips/[id]/profile`,
						params: { id },
					},
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon icon={ICONS.person} focused={focused} />
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
