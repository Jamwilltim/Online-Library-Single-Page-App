const express = require("express");
const path = require("path");
const books = require("./src/books.json");
const fs = require("fs").promises;

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "/src")));

for (const book of books) {
	if (book.authors.length > 3) {
		book.authors = book.authors.slice(0, 3) + " ...";
	}
}

// New releases API
app.get("/api/newreleases", (req, res) => {
	const newReleases = [];
	for (const book of books) {
		if (book.newrelease) {
			newReleases.push(book);
		}
	}
	res.send(newReleases);
});

// Search API
app.get("/api/search", (req, res) => {
	const results = [];
	const title = req.query.book.split();
	for (const book of books) {
		for (let i = 0; i < title.length; i++) {
			if (book.title.split().includes(title[i])) {
				results.push(book);
			}
		}
	}
	if (results.length === 0) {
		results.push("No books found with that title");
	}
	res.send(results);
});

// Library API
let start = 0;
let end = 40;

app.get("/api/books", (req, res) => {
	// Loads the books 40 books at a time to avoid load times
	res.send(books.slice(start, end));
});

// Send variables to client side code
app.get("/api/variables", (req, res) => {
	res.send({ start, end });
});

// POST method to update variables
app.post("/api/variables", (req, res) => {
	start = req.body.start;
	end = req.body.end;
	res.json({ message: "Variables updated successfully" });
});

// POST method to update books
app.post("/api/books", async (req, res) => {
	try {
		const newBook = req.body;
		const data = await fs.readFile("./src/books.json", "utf8");
		const books = JSON.parse(data);

		// Set the id of the new book to be one more than the id of the last book in the array
		newBook._id = books[books.length - 1]._id + 1;

		// Set the authors to be listed in an array
		newBook.authors = newBook.authors.split(",");

		console.log(newBook);
		books.push(newBook);

		await fs.writeFile("./src/books.json", JSON.stringify(books, null, 2));
		res.status(200).send("Book added successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

// POST method to update a book's 'favourited' property
app.post("/api/updateFavourite", async (req, res) => {
	try {
		const updatedBook = req.body;
		const data = await fs.readFile("./src/books.json", "utf8");
		const books = JSON.parse(data);

		// Find the book that needs to be updated
		const bookIndex = books.findIndex((book) => book._id === updatedBook._id);

		// Update the 'favourited' property of the book
		if (bookIndex !== -1) {
			books[bookIndex].favourited = updatedBook.favourited;
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/books.json", JSON.stringify(books, null, 2));
		res.status(200).send("Book updated successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

// Wildcard route to make sure that any request that doesn't match the ones above gets sent to index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/src/index.html"));
});

// Start the server
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}/#home` /* Sets a link in the console to take you to the home page */));
