import { COLORS } from "@/constants/colors";
import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { BText } from "./text";

type InputProps = TextInputProps & {
	ref?: React.RefObject<TextInput | null>;
	wrapperClassName?: string;
	icon?: React.ReactNode;
} & VariantProps<typeof inputVariants>;

function Input({
	className,
	wrapperClassName,
	placeholderTextColor = COLORS.secondary.light,
	icon,
	...props
}: InputProps) {
	return (
		<View className={cn("relative", wrapperClassName)}>
			<TextInput
				className={cn(
					"web:flex web:w-full rounded-md border-2 border-secondary focus:border-primary bg-background px-3 web:py-2 text-foreground web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
					props.editable === false &&
						"opacity-50 web:cursor-not-allowed",
					inputVariants({ ...props }),
					icon && "pl-11",
					className,
				)}
				keyboardAppearance='dark'
				placeholderTextColor={placeholderTextColor}
				style={{ color: "white", fontFamily: "UbuntuMono_400Regular" }}
				clearButtonMode='while-editing'
				{...props}
			/>
			{icon && (
				<BText className='absolute left-4 top-[50%] -translate-y-1/2 text-secondary-light'>
					{icon}
				</BText>
			)}
		</View>
	);
}

const inputVariants = cva(
	"web:flex web:w-full rounded-md border-2 border-secondary focus:border-primary bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			size: {
				DEFAULT: "",
				sm: "",
				lg: "",
				xl: "",
				xl2: "",
			},
			variant: {
				DEFAULT: "",
			},
		},
		defaultVariants: {
			size: "DEFAULT",
			variant: "DEFAULT",
		},
	},
);

export { Input };
