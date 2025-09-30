import { COLORS } from "@/constants/colors";
import { ICONS } from "@/constants/icons";
import { useClipboard } from "@/hooks/useClipboard";
import { Pressable, View } from "react-native";
import { RText } from "./text";

type Props = {
	value: string;
	iconSize?: number;
	label?: string;
};

export function CopyButton({ value, iconSize = 14, label }: Readonly<Props>) {
	const { copy, copied } = useClipboard();

	return (
		<Pressable onPress={() => copy(value)}>
			<View
				style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
			>
				{copied
					? ICONS.check(iconSize, COLORS.primary.DEFAULT)
					: ICONS.copy(iconSize, COLORS.foreground)}
				{label ? (
					<RText size='sm' className='text-muted-foreground'>
						{copied ? "Copied!" : label}
					</RText>
				) : null}
			</View>
		</Pressable>
	);
}
