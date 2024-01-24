const express = require("express");
const path = require("path");
const fs = require("fs").promises;

let books = require("./src/json/books.json");

let reviews = require("./src/json/reviews.json");

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
		res.status(404).send({ message: "No new releases found" });
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

// GET method for number of books
app.get("/api/books/length", (req, res) => {
	if (books.length === 0) {
		res.status(404).send({ message: "No books found" });
	}

	res.send({ total: `${books.length}` });
	res.status(200);
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

	if (req.params.id > books.length) {
		res.status(404).send({ message: "Book not found" });
	}

	if (bookReviews.length === 0) {
		res.status(404).send({ message: "No reviews found" });
	}

	res.send(bookReviews);
	res.status(200);
});

app.get("/api/books", (req, res) => {
	if (books.length === 0) {
		res.status(404).send({ message: "No books found" });
	}

	// Loads the books 40 books at a time to avoid load times
	res.send(books.slice(start, end));
	res.status(200);
});

// Send variables to client side code
app.get("/api/variables", (req, res) => {
	if (start === undefined || end === undefined) {
		res.status(404).send({ message: "Variables not found" });
	}

	res.status(200).send({ start, end });
});

// POST method to update variables
app.post("/api/variables", (req, res) => {
	if (req.body.start === undefined || req.body.end === undefined) {
		res.status(404).send({ message: "Variables not found" });
	}

	if (isNaN(req.body.start) || isNaN(req.body.end)) {
		res.status(400).send({ message: "Start and end must be numbers" });
	}

	if (req.body.start > req.body.end) {
		res.status(400).send({ message: "Start cannot be greater than end" });
	}

	if (req.body.start < 0 || req.body.end < 0) {
		res.status(400).send({ message: "Start and end cannot be negative" });
	}

	if (req.body.start > books.length) {
		res.status(400).send({ message: "Start and end cannot be greater than the number of books" });
	}

	start = req.body.start;
	end = req.body.end;
	res.status(200).send({ message: "Variables updated successfully" });
});

// POST method to update a book's 'favourited' property
app.post("/api/updateFavourite/:id", async (req, res) => {
	try {
		const data = await fs.readFile("./src/json/books.json", "utf8");
		const tempBooks = JSON.parse(data);

		const id = Number(req.params.id);
		if (isNaN(id) || id > books.length) {
			res.status(404).send({ message: "Book not found" });
			return;
		}

		// Find the book that needs to be updated
		const bookIndex = tempBooks.findIndex((book) => book._id === id);

		// Update the 'favourited' property of the book
		if (bookIndex !== -1) {
			tempBooks[bookIndex].favourited = req.body.favourited;
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/json/books.json", JSON.stringify(tempBooks, null, 2));
		books = tempBooks;
		res.status(200).send({ message: "Book updated successfully" });
	} catch (error) {
		res.status(404).send({ message: "An error occurred" });
	}
});

// POST method to delete a book
app.delete("/api/books/:id", async (req, res) => {
	try {
		const data = await fs.readFile("./src/json/books.json", "utf8");
		const tempBooks = JSON.parse(data);

		const id = Number(req.params.id);
		if (isNaN(id) || id > books.length) {
			res.status(404).send({ message: "Book not found" });
			return;
		}

		// Find the book that needs to be deleted
		const bookIndex = tempBooks.findIndex((book) => book._id === id);

		// Delete the book
		if (bookIndex !== -1) {
			tempBooks.splice(bookIndex, 1);
		}

		// Ajust the ids of the books after the deleted book
		for (let i = bookIndex; i < tempBooks.length; i++) {
			tempBooks[i]._id--;
		}

		// Adjust the ids of the reviews of the book after the books is deleted
		for (const review of reviews) {
			if (review.bookId > id) {
				review.bookId--;
			}
		}

		// Write the updated book data back to the file
		await fs.writeFile("./src/json/books.json", JSON.stringify(tempBooks, null, 2));
		books = tempBooks;
		res.status(200).send({ message: "Book deleted successfully" });
	} catch (error) {
		res.status(500).send({ message: "An error occurred" });
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
		res.status(404);
	} else {
		res.status(200);
	}

	res.send(results);
});

// |-------------------- Reviews page API --------------------|
// GET method for reviews
app.get("/api/reviews/", (req, res) => {
	if (reviews.length === 0) {
		res.status(404).send({ message: "No reviews found" });
	}
	res.status(200).send(reviews);
});

app.post("/api/reviews", async (req, res) => {
	try {
		const newReview = req.body;
		const data = await fs.readFile("./src/json/reviews.json", "utf8");
		const tempReviews = JSON.parse(data);

		const book = books.find((book) => book.title === newReview.title);
		if (book) {
			newReview.bookId = book._id;
		} else {
			throw new Error("Book not found");
		}

		// Set the id of the new review to be one more than the id of the last review in the array
		newReview.id = reviews[0].id + 1;

		tempReviews.unshift(newReview);

		await fs.writeFile("./src/json/reviews.json", JSON.stringify(tempReviews, null, 2));
		reviews = tempReviews;
		res.status(200).send({ message: "Review added successfully" });
	} catch (error) {
		res.status(500).send({ message: "An error occurred" });
	}
});

app.delete("/api/reviews/:id", async (req, res) => {
	try {
		const data = await fs.readFile("./src/json/reviews.json", "utf8");
		const tempReviews = JSON.parse(data);

		const id = Number(req.params.id);
		if (isNaN(id)) {
			res.status(404).send({ message: "Review not found" });
			return;
		}

		// Find the review that needs to be deleted
		const review = tempReviews.findIndex((review) => review.id === id);
		tempReviews.splice(review, 1);

		// Write the updated review data back to the file
		await fs.writeFile("./src/json/reviews.json", JSON.stringify(tempReviews, null, 2));
		reviews = tempReviews;
		res.status(200).send({ message: "Review deleted successfully" });
	} catch (error) {
		res.status(500).send({ message: "An error occurred" });
	}
});

// |-------------------- Administrator page API --------------------|
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

// |-------------------- Aditional functions API --------------------|

// Wildcard route to make sure that any request that doesn't match the ones above gets sent to index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/src/index.html"));
});

// |-------------------- Export the app to the server.js file --------------------|
module.exports = app;
