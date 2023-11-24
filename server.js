const express = require("express");
const app = express();
const port = 8080;

app.use(express.static("src"));

app.listen(port, () => console.log(`Server running at http://127.0.0.1:${port}`));
