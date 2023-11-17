const express = require("express");

const app = express();

app.get("/", (request, response) => {
	response.send("Gordon is not our hero");
});

app.listen(8080, () => console.log("App available on http://localhost:8080"));
