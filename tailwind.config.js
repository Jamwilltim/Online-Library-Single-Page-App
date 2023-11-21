/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			backgroundImage: {
				"light-image": "url('../src/img/gradient-background.jpg')",
			},
		},
	},
	plugins: [],
};
