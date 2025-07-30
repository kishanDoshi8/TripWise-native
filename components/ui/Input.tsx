import { COLORS } from "@/constants/colors";
import { cn } from "@/utils/cn";
import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";

function Input({
	className,
	placeholderClassName,
	placeholderTextColor = COLORS.secondary.light,
	...props
}: TextInputProps & {
	ref?: React.RefObject<TextInput>;
}) {
	return (
		<TextInput
			className={cn(
				"web:flex h-10 native:h-14 web:w-full rounded-md border-2 border-input border-secondary active:border-primary bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
				props.editable === false && "opacity-50 web:cursor-not-allowed",
				className
			)}
			keyboardAppearance='dark'
			placeholderClassName={cn(placeholderClassName)}
			placeholderTextColor={placeholderTextColor}
			inlineImageLeft='email'
			style={{ color: "white" }}
			{...props}
		/>
	);
}

export { Input };
