import { COLORS } from "@/constants/colors";
import { cn } from "@/utils/cn";
import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { BText } from "./text";

type InputProps = TextInputProps & {
	ref?: React.RefObject<TextInput>;
	icon?: React.ReactNode;
};

function Input({
	className,
	placeholderClassName,
	placeholderTextColor = COLORS.secondary.light,
	icon,
	...props
}: InputProps) {
	return (
		<View className='relative'>
			{icon && (
				<BText className='absolute left-4 z-10 top-[50%] -translate-y-1/2 text-secondary-light'>
					{icon}
				</BText>
			)}

			<TextInput
				className={cn(
					"web:flex h-10 native:h-14 web:w-full rounded-md border-2 border-secondary focus:border-primary bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
					props.editable === false &&
						"opacity-50 web:cursor-not-allowed",
					icon && "pl-11",
					className
				)}
				keyboardAppearance='dark'
				placeholderClassName={cn(placeholderClassName)}
				placeholderTextColor={placeholderTextColor}
				style={{ color: "white" }}
				clearButtonMode='while-editing'
				{...props}
			/>
		</View>
	);
}

export { Input };
