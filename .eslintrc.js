module.exports = {
	env: { browser: true, jest: true },
	extends: "standard",
	rules: {
		semi: [2, "always"],
		quotes: [2, "double"],
		indent: [0, "off"],
		"no-tabs": [0, "off"],
		"comma-dangle": [0, "off"],
		"no-undef": [0, "off"],
	},
	plugins: ["jest"],
};
