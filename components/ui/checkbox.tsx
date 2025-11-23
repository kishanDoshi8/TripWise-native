import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { cn } from "@/utils/cn";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Platform } from "react-native";

const DEFAULT_HIT_SLOP = 24;

function Checkbox({
	className,
	checkedClassName,
	indicatorClassName,
	iconClassName,
	...props
}: CheckboxPrimitive.RootProps &
	React.RefAttributes<CheckboxPrimitive.RootRef> & {
		checkedClassName?: string;
		indicatorClassName?: string;
		iconClassName?: string;
	}) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				"border-primary dark:bg-input/30 shrink-0 rounded-full border-2 shadow-sm shadow-black/5",
				Platform.select({
					web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed",
					native: "overflow-hidden",
				}),
				props.checked && cn("", checkedClassName),
				props.disabled && "opacity-50",
				className
			)}
			style={[{ width: 22, height: 22 }, (props as any).style]}
			hitSlop={DEFAULT_HIT_SLOP}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className={cn(
					"bg-primary h-full w-full items-center justify-center",
					indicatorClassName
				)}
			>
				{ICONS.check(16, COLORS.primary.foreground)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
