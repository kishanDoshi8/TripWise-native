import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const CText = (props: TextProps) => {
	return (
		<Text style={[styles.defaultFont, props.style]} {...props}>
			{props.children}
		</Text>
	);
};

const styles = StyleSheet.create({
	defaultFont: {
		fontFamily: "UbuntuMono_400Regular",
	},
});

export default CText;
