import { TextClassContext } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { cn } from "@/utils/cn";
import * as AccordionPrimitive from "@rn-primitives/accordion";
import { Platform, Pressable, View } from "react-native";
import Animated, {
	FadeOutUp,
	LayoutAnimationConfig,
	LinearTransition,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated";

function Accordion({
	children,
	...props
}: Omit<AccordionPrimitive.RootProps, "asChild"> &
	React.RefAttributes<AccordionPrimitive.RootRef>) {
	return (
		<LayoutAnimationConfig skipEntering>
			<AccordionPrimitive.Root
				{...(props as AccordionPrimitive.RootProps)}
				asChild={Platform.OS !== "web"}
			>
				<Animated.View layout={LinearTransition.duration(200)}>
					{children}
				</Animated.View>
			</AccordionPrimitive.Root>
		</LayoutAnimationConfig>
	);
}

function AccordionItem({
	children,
	className,
	value,
	...props
}: AccordionPrimitive.ItemProps &
	React.RefAttributes<AccordionPrimitive.ItemRef>) {
	return (
		<AccordionPrimitive.Item
			className={cn(
				// "border-border border-b",
				// Platform.select({ web: "last:border-b-0" }),
				className
			)}
			value={value}
			asChild
			{...props}
		>
			<Animated.View
				className='native:overflow-hidden'
				layout={Platform.select({
					native: LinearTransition.duration(200),
				})}
			>
				{children}
			</Animated.View>
		</AccordionPrimitive.Item>
	);
}

const Trigger = Platform.OS === "web" ? View : Pressable;

function AccordionTrigger({
	className,
	children,
	showIcon = true,
	...props
}: AccordionPrimitive.TriggerProps & {
	children?: React.ReactNode;
	showIcon?: boolean;
} & React.RefAttributes<AccordionPrimitive.TriggerRef>) {
	const { isExpanded } = AccordionPrimitive.useItemContext();

	const progress = useDerivedValue(
		() =>
			isExpanded
				? withTiming(1, { duration: 250 })
				: withTiming(0, { duration: 200 }),
		[isExpanded]
	);
	const chevronStyle = useAnimatedStyle(
		() => ({
			transform: [{ rotate: `${progress.value * 180}deg` }],
		}),
		[progress]
	);

	return (
		<TextClassContext.Provider
			value={cn(
				"text-left",
				Platform.select({ web: "group-hover:underline" })
			)}
		>
			<AccordionPrimitive.Header>
				<AccordionPrimitive.Trigger {...props} asChild>
					<Trigger
						className={cn(
							"flex-row items-start gap-2 rounded-md py-3 disabled:opacity-50",
							Platform.select({
								web: "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none [&[data-state=open]>svg]:rotate-180",
							})
						)}
					>
						<View className={cn(className)}>{children}</View>
						<Animated.View
							className={`ml-auto`}
							style={chevronStyle}
						>
							{showIcon &&
								ICONS.chevronDown(24, COLORS.foreground)}
						</Animated.View>
					</Trigger>
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
		</TextClassContext.Provider>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: AccordionPrimitive.ContentProps &
	React.RefAttributes<AccordionPrimitive.ContentRef>) {
	const { isExpanded } = AccordionPrimitive.useItemContext();
	return (
		<TextClassContext.Provider value='text-sm'>
			<AccordionPrimitive.Content
				className={cn(
					"overflow-hidden",
					Platform.select({
						web: isExpanded
							? "animate-accordion-down"
							: "animate-accordion-up",
					})
				)}
				{...props}
			>
				<Animated.View
					exiting={Platform.select({
						native: FadeOutUp.duration(200),
					})}
					className={cn("", className)}
				>
					{children}
				</Animated.View>
			</AccordionPrimitive.Content>
		</TextClassContext.Provider>
	);
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
