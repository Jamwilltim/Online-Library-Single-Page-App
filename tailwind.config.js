/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			backgroundImage: {
				"light-image": "url('img/gradient-background.jpg')",
			},
			screens: {
				"1080p": { raw: "(resolution: 192dpi)" },
				"1440p": { raw: "(resolution: 288dpi)" },
			},
		},
	},
	plugins: [],
};
