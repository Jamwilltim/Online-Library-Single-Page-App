const express = require("express");
const path = require("path");
let books = require("./src/json/books.json");
let reviews = require("./src/json/reviews.json");
const fs = require("fs").promises;

const app = express();

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
	if (newReleases.length === 0) {
		res.status(404).send("No new releases found");
	}
	res.status(200).send(newReleases);
});

// GET method for favourites
app.get("/api/favourites", (req, res) => {
	const favourites = [];
	for (const book of books) {
		if (book.favourited) {
			favourites.push(book);
		}
	}

	if (favourites.length === 0) {
		res.status(404).send({ message: "No favourites found" });
	}

	res.send(favourites);
});

// |-------------------- Library page API --------------------|
let start = 0;
let end = 40;

app.get("/api/books/:id", (req, res) => {
	const book = books.find((book) => book._id === parseInt(req.params.id));
	if (!book) {
		res.status(404).send({ message: "Book not found" });
	} else {
		res.send(book);
		res.status(200);
	}
});

app.get("/api/books/:id/reviews", (req, res) => {
	const bookReviews = [];
	for (const review of reviews) {
		if (review.id === parseInt(req.params.id)) {
			bookReviews.push(review);
		}
	}

	if (bookReviews.length === 0) {
		res.status(404).send({ message: "No reviews found" });
	}

	res.send(bookReviews);
	res.status(200);
});

app.get("/api/books", (req, res) => {
	// Loads the books 40 books at a time to avoid load times
	res.send(books.slice(start, end));
	res.status(200);
});

app.get("/api/numberbooks", (req, res) => {
	res.send(`${books.length}`);
	res.status(200);
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
		const tempBooks = JSON.parse(data);

		// Set the id of the new book to be one more than the id of the last book in the array
		newBook._id = books[tempBooks.length - 1]._id + 1;
		newBook.favourited = false;

		// Set the authors to be listed in an array
		newBook.authors = newBook.authors.split(",");

		tempBooks.push(newBook);

		await fs.writeFile("./src/json/books.json", JSON.stringify(tempBooks, null, 2));
		books = tempBooks;
		res.status(201).send({ message: "Book added successfully" });
	} catch (error) {
		res.status(500).send({ message: "An error occurred" });
	}
});

// POST method to update a book's 'favourited' property
app.post("/api/updateFavourite", async (req, res) => {
	try {
		const updatedBook = req.body;
		const data = await fs.readFile("./src/json/books.json", "utf8");
		const tempBooks = JSON.parse(data);

		// Find the book that needs to be updated
		const bookIndex = tempBooks.findIndex((book) => book._id === updatedBook._id);

		// Update the 'favourited' property of the book
		if (bookIndex !== -1) {
			tempBooks[bookIndex].favourited = updatedBook.favourited;
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/json/books.json", JSON.stringify(tempBooks, null, 2));
		books = tempBooks;
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
		const tempBooks = JSON.parse(data);

		// Find the book that needs to be deleted
		const bookIndex = tempBooks.findIndex((book) => book._id === bookToDelete._id);

		// Delete the book
		if (bookIndex !== -1) {
			tempBooks.splice(bookIndex, 1);
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/json/books.json", JSON.stringify(tempBooks, null, 2));
		books = tempBooks;
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

app.post("/api/reviews", async (req, res) => {
	try {
		const newReview = req.body;
		const data = await fs.readFile("./src/json/reviews.json", "utf8");
		const tempReviews = JSON.parse(data);

		const book = books.find((book) => book.title === newReview.title);
		if (book) {
			newReview.id = book._id;
		} else {
			throw new Error("Book not found");
		}

		tempReviews.unshift(newReview);

		await fs.writeFile("./src/json/reviews.json", JSON.stringify(tempReviews, null, 2));
		reviews = tempReviews;
		res.status(200).send("Review added successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

app.delete("/api/reviews", async (req, res) => {
	try {
		const reviewToDelete = req.body;
		const data = await fs.readFile("./src/json/reviews.json", "utf8");
		const tempReviews = JSON.parse(data);

		// Find the review that needs to be deleted
		const reviewIndex = tempReviews.findIndex((review) => review.id === reviewToDelete.id);

		// Delete the review
		if (reviewIndex !== -1) {
			tempReviews.splice(reviewIndex, 1);
		}

		// Write the updated review data back to the file
		await fs.writeFile("./src/json/reviews.json", JSON.stringify(tempReviews, null, 2));
		reviews = tempReviews;
		res.status(200).send("Review deleted successfully");
	} catch (error) {
		res.status(500).send("An error occurred");
	}
});

// |-------------------- Aditional functions API --------------------|
// Wildcard route to make sure that any request that doesn't match the ones above gets sent to index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/src/index.html"));
});

// |-------------------- Export the app to the server.js file --------------------|
module.exports = app;
