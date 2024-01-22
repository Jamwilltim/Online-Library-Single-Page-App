const app = require("./app");
const PORT = 8080;

// Start the server
app.listen(PORT, () =>
	console.log(`Server running at http://127.0.0.1:${PORT}/#home` /* Sends a link to the console to take you to the home page */)
);
