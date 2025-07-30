module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			// update constants/colors when you update colors here
			colors: {
				background: "#020617",
				foreground: "#dcfce7",
				primary: {
					DEFAULT: "#15803d", //700
					light: "#4ade80", //400
					dark: "#052e16", //950
					contrast: "#dcfce7", //100
				},
				secondary: {
					DEFAULT: "#334155",
					light: "#94a3b8",
					dark: "#020617",
					contrast: "#f1f5f9",
				},
				accent: {
					DEFAULT: "#0e7490",
					light: "#22d3ee",
					dark: "#083344",
					contrast: "#cffafe",
				},
			},
		},
	},
	plugins: [],
};
