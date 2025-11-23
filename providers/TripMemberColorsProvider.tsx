import React, { createContext, useContext, useMemo } from "react";

const fallbackColors = [
	"#f87171",
	"#facc15",
	"#34d399",
	"#60a5fa",
	"#a78bfa",
	"#fb923c",
	"#f472b6",
	"#2dd4bf",
];

type Member = { user: { id: string } };
type ColorMap = Record<string, string>;

const TripMemberColorsContext = createContext<ColorMap>({});

export function TripMemberColorsProvider({
	members,
	children,
}: Readonly<{
	members: Member[];
	children: React.ReactNode;
}>) {
	const colorMap = useMemo(() => {
		const map: ColorMap = {};
		let i = 0;
		for (const m of members) {
			const id = m.user.id;
			if (!map[id]) {
				map[id] = fallbackColors[i % fallbackColors.length];
				i++;
			}
		}
		return map;
	}, [members]);

	return (
		<TripMemberColorsContext.Provider value={colorMap}>
			{children}
		</TripMemberColorsContext.Provider>
	);
}

export function useTripMemberColors() {
	return useContext(TripMemberColorsContext);
}
