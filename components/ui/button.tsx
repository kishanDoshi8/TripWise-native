import { COLORS } from "@/constants/colors";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { BText, TextClassContext } from "./text";

const buttonVariants = cva(
	"group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			color: {
				default: "",
				primary: "",
				secondary: "",
				accent: "",
				danger: "",
			},
			variant: {
				solid: "",
				bordered: "border",
				flat: "",
				ghost: "",
			},
			size: {
				default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8 native:h-14",
				iconSmall: "h-8 w-8",
				icon: "h-10 w-10",
				iconMedium: "h-12 w-12",
				iconLarge: "h-16 w-16",
			},
		},
		compoundVariants: [
			// Solid variants
			{
				variant: "solid",
				color: "default",
				className: "bg-default web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "primary",
				className: "bg-primary web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "secondary",
				className:
					"bg-secondary web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "danger",
				className: "bg-danger web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "accent",
				className: "bg-accent web:hover:opacity-90 active:opacity-90",
			},
			// Bordered variants
			{
				variant: "bordered",
				color: "default",
				className:
					"bg-default border-primary web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "primary",
				className:
					"bg-transparent border-primary web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "secondary",
				className:
					"bg-transparent border-secondary web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "danger",
				className:
					"bg-transparent border-danger web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "accent",
				className:
					"bg-transparent border-accent web:hover:opacity-90 active:opacity-90",
			},
			// Flat
			{
				variant: "flat",
				color: "default",
				className:
					"bg-default-dark web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "primary",
				className:
					"bg-primary-dark web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "secondary",
				className:
					"bg-secondary-dark web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "danger",
				className:
					"bg-danger-dark web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "accent",
				className:
					"bg-accent-dark web:hover:opacity-90 active:opacity-90",
			},
			// Ghost
			{
				variant: "ghost",
				color: "default",
				className:
					"bg-transparent web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "primary",
				className:
					"bg-transparent web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "secondary",
				className:
					"bg-transparent web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "danger",
				className:
					"bg-transparent web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "accent",
				className:
					"bg-transparent web:hover:opacity-90 active:opacity-90",
			},
		],
		defaultVariants: {
			variant: "solid",
			color: "primary",
			size: "default",
		},
	}
);

const buttonTextVariants = cva(
	"web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
	{
		variants: {
			variant: {
				solid: "",
				bordered: "",
				flat: "",
				ghost: "",
			},
			color: {
				default: "",
				primary: "",
				secondary: "",
				danger: "",
				accent: "",
			},
			size: {
				default: "",
				sm: "",
				lg: "native:text-lg",
				iconSmall: "",
				icon: "",
				iconMedium: "",
				iconLarge: "text-2xl",
			},
		},
		compoundVariants: [
			// Solid
			{
				variant: "solid",
				color: "default",
				className:
					"text-default-foreground web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "primary",
				className:
					"text-primary-foreground web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "secondary",
				className:
					"text-secondary-foreground web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "danger",
				className:
					"text-danger-foreground web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "solid",
				color: "accent",
				className:
					"text-accent-foreground web:hover:opacity-90 active:opacity-90",
			},
			// Bordered
			{
				variant: "bordered",
				color: "default",
				className:
					"text-default web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "primary",
				className:
					"text-primary web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "secondary",
				className:
					"text-secondary-light web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "danger",
				className: "text-danger web:hover:opacity-90 active:opacity-90",
			},
			{
				variant: "bordered",
				color: "accent",
				className: "text-accent web:hover:opacity-90 active:opacity-90",
			},
			// Flat
			{
				variant: "flat",
				color: "default",
				className:
					"text-default-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "primary",
				className:
					"text-primary-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "secondary",
				className:
					"text-secondary-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "danger",
				className: "text-danger-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "flat",
				color: "accent",
				className: "text-accent-light web:opacity-90 active:opacity-90",
			},
			// Ghost
			{
				variant: "ghost",
				color: "default",
				className:
					"text-default-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "primary",
				className:
					"text-primary-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "secondary",
				className:
					"text-secondary-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "danger",
				className: "text-danger-light web:opacity-90 active:opacity-90",
			},
			{
				variant: "ghost",
				color: "accent",
				className: "text-accent-light web:opacity-90 active:opacity-90",
			},
		],
		defaultVariants: {
			variant: "solid",
			color: "primary",
			size: "default",
		},
	}
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
	VariantProps<typeof buttonVariants> & {
		isLoading?: boolean;
		icon?: React.ReactNode;
		fullWidth?: boolean;
	};

function Button({
	ref,
	className,
	variant,
	color,
	size,
	isLoading = false,
	icon,
	fullWidth = false,
	children,
	...props
}: ButtonProps) {
	const isDisabled = props.disabled || isLoading;
	return (
		<TextClassContext.Provider
			value={buttonTextVariants({
				variant,
				color,
				size,
				className: "web:pointer-events-none",
			})}
		>
			<Pressable
				style={{ userSelect: "none" }}
				className={cn(
					isDisabled && "opacity-70 web:pointer-events-none",
					fullWidth ? "w-full" : "self-start",
					buttonVariants({ variant, color, size, className })
				)}
				ref={ref}
				accessibilityRole='button'
				{...props}
			>
				<View
					pointerEvents='none'
					className='flex-row gap-2 items-center justify-center select-none'
				>
					{isLoading && (
						<ActivityIndicator color={COLORS.accent.light} />
					)}
					{!isLoading && icon && <BText>{icon}</BText>}
					<>{children}</>
				</View>
			</Pressable>
		</TextClassContext.Provider>
	);
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
