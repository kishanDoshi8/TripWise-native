import { cn } from "@/utils/cn";
import * as Slot from "@rn-primitives/slot";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

export const textVariants = cva("text-base web:select-text", {
	variants: {
		variant: {
			default: "text-white",
			muted: "text-secondary-light",
			primary: "text-primary",
			light: "text-primary-light",
			secondary: "text-secondary-light",
			accent: "text-accent-light",
			danger: "text-red-600",
		},
		size: {
			sm: "text-sm",
			base: "text-base",
			lg: "text-lg",
			xl: "text-xl",
			xl2: "text-2xl",
			xl4: "text-4xl",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "base",
	},
});

export type TextProps = React.ComponentProps<typeof RNText> &
	TextVariantProps & {
		ref?: React.RefObject<RNText>;
		asChild?: boolean;
	};

function RText({
	className,
	asChild = false,
	variant,
	size,
	selectable = true,
	...props
}: TextProps) {
	const textClass = React.useContext(TextClassContext);
	const Component = asChild ? Slot.Text : RNText;
	return (
		<Component
			className={cn(
				textVariants({ variant, size }),
				textClass,
				className
			)}
			style={[{ fontFamily: "UbuntuMono_400Regular" }, props.style]}
			selectable={true}
			{...props}
		/>
	);
}

function BText({
	className,
	asChild = false,
	variant,
	size,
	...props
}: TextProps) {
	const textClass = React.useContext(TextClassContext);
	const Component = asChild ? Slot.Text : RNText;
	return (
		<Component
			className={cn(
				textVariants({ variant, size }),
				textClass,
				className
			)}
			style={[
				{ fontFamily: "UbuntuMono_700Bold", overflow: "visible" },
				props.style,
			]}
			selectable
			{...props}
		/>
	);
}

function IText({
	className,
	asChild = false,
	variant,
	size,
	...props
}: TextProps) {
	const textClass = React.useContext(TextClassContext);
	const Component = asChild ? Slot.Text : RNText;
	return (
		<Component
			className={cn(
				textVariants({ variant, size }),
				textClass,
				className
			)}
			style={[
				{
					fontFamily: "UbuntuMono_400Regular_Italic",
					overflow: "visible",
				},
				props.style,
			]}
			selectable
			{...props}
		/>
	);
}

export { BText, IText, RText, TextClassContext };
export type TextVariantProps = VariantProps<typeof textVariants>;
