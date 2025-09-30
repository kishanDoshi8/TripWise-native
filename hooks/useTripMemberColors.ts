import { useMemo } from "react";

const fallbackColors = [
    "#f87171", // red
	"#facc15", // yellow
	"#34d399", // green
	"#60a5fa", // blue
	"#a78bfa", // purple
	"#fb923c", // orange
	"#f472b6", // pink
	"#2dd4bf", // teal
]

export function useTripMemberColors(members: { user: { id: string } }[]) {
	return useMemo(() => {
		const colorMap: Record<string, string> = {};
		let colorIndex = 0;

		for (const member of members) {
			const userId = member.user.id;
			if (!colorMap[userId]) {
				colorMap[userId] = fallbackColors[colorIndex % fallbackColors.length];
				colorIndex++;
			}
		}

		return colorMap;
	}, [members]);
}
