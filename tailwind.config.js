/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			backgroundImage: {
				"light-image": "url('img/gradient-background.jpg')"
			},
			screens: {
				"1080p": "1920px",
				"1440p": "2560px"
			}
		}
	},
	plugins: []
};
