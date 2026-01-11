import { COLORS } from "@/constants/colors";
import React from "react";
import { RefreshControl as Rc, RefreshControlProps } from "react-native";

const RefreshControl = (props: RefreshControlProps) => {
	return (
		<Rc
			colors={[COLORS.accent.light]}
			progressBackgroundColor={COLORS.secondary.DEFAULT}
			tintColor={COLORS.accent.light}
			{...props}
		/>
	);
};

export default RefreshControl;
