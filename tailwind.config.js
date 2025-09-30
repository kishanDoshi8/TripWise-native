module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./features/**/*.{js,jsx,ts,tsx}",
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
					dark: "#052e16", //950 - 900
					foreground: "#ffffff", //100
				},
				secondary: {
					DEFAULT: "#334155",
					light: "#94a3b8",
					dark: "#0f172a",
					foreground: "#ffffff",
				},
				accent: {
					DEFAULT: "#0e7490",
					light: "#22d3ee",
					dark: "#083344",
					foreground: "#ffffff",
				},
				danger: {
					DEFAULT: "#b91c1c",
					light: "#f87171",
					dark: "#7f1d1d",
					foreground: "#fef2f2",
				},
			},
		},
	},
	plugins: [],
};
