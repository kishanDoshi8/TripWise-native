import { cn } from "@/utils/cn";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
	className,
	asChild = false,
	...props
}: React.ComponentProps<typeof RNText> & {
	ref?: React.RefObject<RNText>;
	asChild?: boolean;
}) {
	const textClass = React.useContext(TextClassContext);
	const Component = asChild ? Slot.Text : RNText;
	return (
		<Component
			className={cn("text-base web:select-text", textClass, className)}
			style={{ fontFamily: "UbuntuMono_700Bold" }}
			{...props}
		/>
	);
}

export { Text, TextClassContext };
