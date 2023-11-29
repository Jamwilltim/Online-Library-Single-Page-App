/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			backgroundImage: {
				"light-image": "url('img/gradient-background.jpg')",
			},
			height: {
				"35v": "35vh",
			},
		},
	},
	plugins: [],
};
