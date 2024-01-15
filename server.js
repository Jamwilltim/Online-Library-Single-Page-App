const express = require("express");
const path = require("path");
let books = require("./src/json/books.json");
let reviews = require("./src/json/reviews.json");
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

// |-------------------- Home page API --------------------|
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

// GET method for favourites
app.get("/api/favourites", (req, res) => {
	const favourites = [];
	for (const book of books) {
		if (book.favourited) {
			favourites.push(book);
		}
	}
	res.send(favourites);
});

// |-------------------- Library page API --------------------|
let start = 0;
let end = 40;

app.get("/api/books", (req, res) => {
	// Loads the books 40 books at a time to avoid load times
	res.send(books.slice(start, end));
});

app.get("/api/numberbooks", (req, res) => {
	res.send(`${books.length}`);
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
		const data = await fs.readFile("./src/json/books.json", "utf8");
		const temp_books = JSON.parse(data);

		// Set the id of the new book to be one more than the id of the last book in the array
		newBook._id = books[temp_books.length - 1]._id + 1;

		// Set the authors to be listed in an array
		newBook.authors = newBook.authors.split(",");

		console.log(newBook);
		temp_books.push(newBook);

		await fs.writeFile("./src/json/books.json", JSON.stringify(temp_books, null, 2));
		books = temp_books;
		res.status(200).send("Book added successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

// POST method to update a book's 'favourited' property
app.post("/api/updateFavourite", async (req, res) => {
	try {
		const updatedBook = req.body;
		const data = await fs.readFile("./src/json/books.json", "utf8");
		const temp_books = JSON.parse(data);

		// Find the book that needs to be updated
		const bookIndex = temp_books.findIndex((book) => book._id === updatedBook._id);

		// Update the 'favourited' property of the book
		if (bookIndex !== -1) {
			temp_books[bookIndex].favourited = updatedBook.favourited;
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/json/books.json", JSON.stringify(temp_books, null, 2));
		books = temp_books;
		res.status(200).send("Book updated successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

// POST method to delete a book
app.delete("/api/books", async (req, res) => {
	try {
		const bookToDelete = req.body;
		const data = await fs.readFile("./src/json/books.json", "utf8");
		const temp_books = JSON.parse(data);

		// Find the book that needs to be deleted
		const bookIndex = temp_books.findIndex((book) => book._id === bookToDelete._id);

		// Delete the book
		if (bookIndex !== -1) {
			temp_books.splice(bookIndex, 1);
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/json/books.json", JSON.stringify(temp_books, null, 2));
		books = temp_books;
		res.status(200).send("Book deleted successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

// GET method to search for books
app.get("/api/search", (req, res) => {
	const results = [];
	const title = req.query.book.toLowerCase();

	for (const book of books) {
		if (book.title.toLowerCase().includes(title)) {
			results.push(book);
		}
	}

	if (results.length === 0) {
		results.push({ title: "No results found", thumbnailUrl: "img/no-results.jpg", authors: "", _id: 0 });
	}

	res.send(results);
});

// |-------------------- Reviews page API --------------------|
// GET method for reviews
app.get("/api/reviews", (req, res) => {
	res.send(reviews);
});

// |-------------------- Aditional functions API --------------------|
// Wildcard route to make sure that any request that doesn't match the ones above gets sent to index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/src/index.html"));
});

// Start the server
app.listen(PORT, () =>
	console.log(`Server running at http://127.0.0.1:${PORT}/#home` /* Sends a link to the console to take you to the home page */)
);
