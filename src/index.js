// |-------------------- Page Switching functions --------------------|
// Redirect to the home page if the url is just the domain
if (window.location.href.split("/").pop() === "") {
	window.location.href = window.location.href + "#home";
}

// Function to get current page based on url
const getCurrentPage = () => {
	return window.location.href.split("/").pop().split("#").pop();
};

// Define the menu buttons and pages
const menuButtons = document.querySelectorAll(".sidebar-buttons");
const pages = document.querySelectorAll(".main-page");

// Function to change the styling on the selcted page button
const changeActiveButton = (newActiveButtonId) => {
	const activeButton = document.querySelector(".active-button");
	if (activeButton) {
		activeButton.classList.remove("active-button");
	}
	const newActiveButton = document.getElementById(newActiveButtonId);
	if (newActiveButton) {
		newActiveButton.classList.add("active-button");
	}
};

// Add event listeners to the menu buttons
menuButtons.forEach((e) => {
	e.addEventListener("click", () => {
		changeActiveButton(e.id);
		changePages();
	});
});

// Function to change the pages by adjusting their opacity, this allows for a fade transition
const changePages = () => {
	const currentPage = getCurrentPage();
	for (let i = 0; i < pages.length; i++) {
		if (menuButtons[i].id === currentPage.concat("-button")) {
			pages[i].classList.remove("opacity-0");
			pages[i].classList.add("opacity-100");
			pages[i].classList.add("z-10");
		} else {
			pages[i].classList.remove("opacity-100");
			pages[i].classList.add("opacity-0");
			pages[i].classList.remove("z-10");
		}
	}
};

// Add event listener to the window to change the page when the url changes
window.onhashchange = () => {
	changeActiveButton(getCurrentPage().concat("-button"));
	changePages();
};

// When the page loads, change the active button and page so they match the url
changeActiveButton(getCurrentPage().concat("-button"));
changePages();

// |-------------------- Home page js --------------------|
// New releases section
const loadNewReleases = async () => {
	try {
		const response = await fetch("/api/newreleases");
		const books = await response.json();
		return books;
	} catch (error) {
		console.error("Error fetching new releases data:", error);
		throw error;
	}
};

const renderNewReleases = async () => {
	const newReleases = document.getElementById("new-releases-container");
	try {
		const books = await loadNewReleases();
		books.forEach((book) => {
			const image = document.createElement("img");
			image.src = book.thumbnailUrl;
			image.alt = "Book Thumbnail";
			const imageContainer = document.createElement("div");
			imageContainer.classList.add("pb-2", "h-max-[188px]");
			imageContainer.appendChild(image);
			const title = document.createElement("h3");
			title.classList.add("font-bold", "text-center");
			title.innerText = book.title;
			const author = document.createElement("p");
			author.classList.add("w-2/3", "text-center");
			author.innerText = book.authors;
			const newRelease = document.createElement("div");
			newRelease.classList.add("flex", "justify-center", "flex-col", "items-center", "h-5/6", "m-4", "w-40");
			newRelease.appendChild(imageContainer);
			newRelease.appendChild(title);
			newRelease.appendChild(author);
			newReleases.appendChild(newRelease);
		});
	} catch (error) {
		console.error("Error rendering the new release images:", error);
	}
};

// Render the new releases on load
renderNewReleases();

// Digit spinner for the number of books sold in the last year
const refresh = document.getElementById("refresh-button");

const getNumberOfBooks = async () => {
	try {
		const response = await fetch("/json/books.json");
		const data = await response.json();
		const numberOfBooks = data.length;
		return numberOfBooks;
	} catch (error) {
		console.error("Error fetching number of books data:", error);
		throw error;
	}
};

const digits = document.getElementsByClassName("digit");

// Event listener for the refresh button
refresh.addEventListener("click", async () => {
	const numberBooks = await getNumberOfBooks().catch((error) => console.error(error));
	refreshnumberBooks(numberBooks);
});

// Function which translates the spinner such that the correct digit is displayed
// Each digit has index * 10 numbers in it so it needs to be translated more the higher the index
// Inspired by hyperplexed's video on YouTube: https://www.youtube.com/watch?v=HIrDMR6CaHY&ab_channel=Hyperplexed
const displaynumberBooks = async () => {
	const num = await getNumberOfBooks().catch((error) => console.error(error));
	const numArray = Array.from(String(num), Number);
	for (let i = 0; i < digits.length; i++) {
		const digit = digits[i];
		const index = numArray[i];
		digit.style.translate = `0 -${45 * (10 * i + index)}px`;
	}
};

// Handles the refresh button being clicked
const refreshnumberBooks = (num) => {
	const numArray = Array.from(String(num), Number);
	for (let i = 0; i < digits.length; i++) {
		const digit = digits[i];
		const index = numArray[i];
		digit.style.transitionDuration = "0s";
		digit.style.translate = "0 0";
		setTimeout(() => {
			digit.style.transitionDuration = "2s";
			digit.style.translate = `0 -${45 * (10 * i + index)}px`;
		}, 1);
	}
};

// Play the animation when the page loads
displaynumberBooks();

// Display favourite books on home page
const loadFavourites = async () => {
	try {
		const response = await fetch("/api/favourites");
		const books = await response.json();
		return books;
	} catch (error) {
		console.error("Error fetching favourites data:", error);
		throw error;
	}
};

const renderFavourites = async () => {
	const favourites = document.getElementById("favourites");
	favourites.innerHTML = "";

	try {
		const books = await loadFavourites();
		books.forEach((book) => {
			createFavouriteElement(book, favourites);
		});
	} catch (error) {
		console.error("Error rendering the favourites:", error);
	}
};

// Function to create a favourite element
const createFavouriteElement = (book, container) => {
	const bookContainer = document.createElement("div");
	bookContainer.classList.add(
		"rounded-3xl",
		"w-full",
		"h-16",
		"bg-gray-200",
		"flex",
		"justify-between",
		"items-center",
		"p-4",
		"mt-4",
		"transition",
		"duration-500",
		"ease-in-out",
		"hover:bg-gray-300"
	);

	const textContainer = document.createElement("div");
	textContainer.classList.add("flex", "flex-col", "justify-center", "items-start");

	const title = document.createElement("h3");
	title.classList.add("font-bold", "text-black", "text-sm");
	title.innerText = book.title;

	const author = document.createElement("p");
	author.classList.add("text-sm");
	author.innerText = book.authors;

	textContainer.appendChild(title);
	textContainer.appendChild(author);

	const favouriteButton = document.createElement("button");
	const favouriteIcon = document.createElement("i");
	favouriteIcon.classList.add("fa-solid", "fa-heart", "text-red-500");
	favouriteButton.classList.add("rounded-full", "p-2", "w-10", "h-10", "hover:bg-gray-200");
	favouriteButton.appendChild(favouriteIcon);

	// Add an event listener to toggle the heart icon and send a POST request to the server-side script
	favouriteButton.addEventListener("click", async function () {
		// Toggle the 'favourited' property of the book
		book.favourited = !book.favourited;
		container.removeChild(bookContainer); // Remove the book from the favourites

		// Send a POST request to the server-side script
		try {
			const response = await fetch("/api/updateFavourite", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(book)
			});

			const data = await response.text();
			console.log("Success:", data);
		} catch (error) {
			console.error("Error:", error);
		}
	});

	bookContainer.appendChild(textContainer);
	bookContainer.appendChild(favouriteButton);

	container.appendChild(bookContainer);
};

// Render the favourites on load
renderFavourites();

// |-------------------- Library page js --------------------|
// Load books to library
const loadBooks = async () => {
	try {
		const response = await fetch("/api/books");
		const books = await response.json();

		// Sort the books by _id
		books.sort((a, b) => a._id - b._id);

		return books;
	} catch (error) {
		console.error("Error fetching books data:", error);
		throw error;
	}
};

let start, end;

// Display books in library
const renderBooks = async () => {
	const books = document.getElementById("books-container");

	const variablesResponse = await fetch("/api/variables");
	const variables = await variablesResponse.json();

	start = variables.start;
	end = variables.end;

	try {
		const booksArray = await loadBooks();
		booksArray.forEach((book) => {
			createBookElement(book, books);
		});
		sendVariables(start + 40, end + 40); // Send the updated start and end variables to the server
	} catch (error) {
		console.error("Error rendering the books:", error);
	}
};

const createBookElement = (book, books) => {
	// Create the image element
	const image = document.createElement("img");
	image.src = book.thumbnailUrl;
	image.alt = "Book Thumbnail";
	image.classList.add("h-full", "no-select");

	// Store the image in a container to aid in positioning
	const imageContainer = document.createElement("div");
	imageContainer.classList.add("pb-2");
	imageContainer.appendChild(image);

	// Create title text (bold)
	const title = document.createElement("h3");
	title.classList.add("font-bold", "text-center", "w-full");
	title.innerText = book.title;

	// Create author text
	const author = document.createElement("p");
	author.classList.add("w-2/3", "text-center", "w-full");
	author.innerText = book.authors;

	// Create a div for the front of the card
	const bookFront = document.createElement("div");
	bookFront.classList.add("flex", "flex-col", "justify-around", "items-center", "h-full", "no-select");
	bookFront.appendChild(imageContainer); // Append all of the elements on the front
	bookFront.appendChild(title);
	bookFront.appendChild(author);

	// Add an event listener to flip the card when clicked
	bookFront.addEventListener("click", () => {
		bookFront.classList.toggle("hidden"); // Toggle the visibility of the front of the card
		bookBack.classList.toggle("hidden"); // Toggle the visibility of the back of the card
	});

	// Create a div for the buttons on the back of the card
	const buttons = document.createElement("div");
	buttons.classList.add("flex", "justify-between", "w-full", "mb-4", "no-select");

	// Create a heart button to toggle whether the book is favourited
	const favouriteButton = document.createElement("button");
	const favouriteIcon = document.createElement("i");

	// Check if the book is favourited
	if (book.favourited) {
		favouriteIcon.classList.add("fa-solid", "fa-heart", "text-red-500");
	} else {
		favouriteIcon.classList.add("fa-regular", "fa-heart");
	}

	// Add an event listener to toggle the heart icon and send a POST request to the server-side script
	favouriteButton.addEventListener("click", async function () {
		// Toggle the 'favourited' property of the book
		book.favourited = !book.favourited;

		// Update the heart icon
		if (book.favourited) {
			favouriteIcon.classList.remove("fa-regular");
			favouriteIcon.classList.add("fa-solid", "text-red-500");
		} else {
			favouriteIcon.classList.remove("fa-solid", "text-red-500");
			favouriteIcon.classList.add("fa-regular");
		}

		// Send a POST request to the server-side script
		try {
			const response = await fetch("/api/updateFavourite", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(book)
			});

			const data = await response.text();
			console.log("Success:", data);

			// If the book is favourited, add it to the favourites section
			renderFavourites();
		} catch (error) {
			console.error("Error:", error);
		}
	});

	// Append the heart icon to the button
	favouriteButton.appendChild(favouriteIcon);
	favouriteButton.classList.add("rounded-full", "p-2", "w-10", "h-10", "hover:bg-gray-200");

	// Create a button that deletes the book
	const deleteButton = document.createElement("button");
	const deleteIcon = document.createElement("i");
	deleteIcon.classList.add("fa-solid", "fa-trash", "text-black");
	deleteButton.classList.add("rounded-full", "p-2", "w-10", "h-10", "hover:bg-gray-200");

	deleteButton.appendChild(deleteIcon); // Append the icon to the button

	// Add an event listener to delete the book when clicked
	deleteButton.addEventListener("click", async () => {
		// Ask if the user is sure they want to delete the book
		const confirmDelete = window.confirm("Are you sure you want to delete this book?");

		// If the user clicked OK, delete the book
		if (confirmDelete) {
			try {
				const response = await fetch("/api/books", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(book)
				});

				renderBooks();
				if (book.newrelease) {
					renderNewReleases();
				}

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				} else {
					books.removeChild(bookContainer); // Remove the book from the library
					const data = await response.text();
					console.log("Success:", data);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	});

	// Create a button that flips the card
	const flipButton = document.createElement("button");
	const flipIcon = document.createElement("i");
	flipIcon.classList.add("fa-solid", "fa-shuffle", "text-black");
	flipButton.classList.add("rounded-full", "p-2", "w-10", "h-10", "hover:bg-gray-200");

	flipButton.appendChild(flipIcon); // Append the icon to the button

	// Add an event listener to flip the card when clicked
	flipButton.addEventListener("click", () => {
		bookFront.classList.toggle("hidden"); // Toggle the visibility of the front of the card
		bookBack.classList.toggle("hidden"); // Toggle the visibility of the back of the card
	});

	// Append the buttons to the button container
	buttons.appendChild(favouriteButton);
	buttons.appendChild(deleteButton);
	buttons.appendChild(flipButton);

	// Create a description of the book
	const description = document.createElement("p");
	const descriptionContainer = document.createElement("div"); // Create a div to contain the description

	descriptionContainer.classList.add("overflow-y-scroll", "h-4/5", "scrollbar");
	description.classList.add("text-center", "w-full", "text-black", "cursor-text");
	description.innerText = book.shortDescription;

	descriptionContainer.appendChild(description); // Append the description to the container

	// Create a div for the back of the card
	const bookBack = document.createElement("div");
	bookBack.classList.add("h-full", "hidden", "cursor-default", "w-full");
	bookBack.appendChild(buttons); // Append the buttons
	bookBack.appendChild(descriptionContainer); // Append the description

	// Create a div for the whole card
	const bookContainer = document.createElement("div");
	bookContainer.classList.add(
		"flex",
		"justify-around",
		"flex-col",
		"items-center",
		"bg-white",
		"rounded-3xl",
		"p-4",
		"m-4",
		"w-60",
		"h-80",
		"cursor-pointer",
		"overflow-hidden"
	);
	bookContainer.id = "books-container";

	bookContainer.appendChild(bookFront); // Append the front of the card
	bookContainer.appendChild(bookBack); // Append the back of the card
	books.appendChild(bookContainer); // Append the whole card
};

// When the library page link is clicked, render the books
const libraryButton = document.getElementById("library-button");

libraryButton.addEventListener("click", () => {
	renderBooks();
});

window.onload = () => {
	if (getCurrentPage() === "library") {
		renderBooks();
	}
};

// Load more books
const loadMore = document.getElementById("load-more");
const booksOuterContainer = document.getElementById("books-outer-container");

loadMore.classList.add("opacity-0"); // Hide the load more button

// When the user scrolls to the bottom of the page, show the load more button
booksOuterContainer.onscroll = () => {
	if (document.getElementById("search").value === "") {
		if (booksOuterContainer.scrollTop + booksOuterContainer.clientHeight >= booksOuterContainer.scrollHeight - 30) {
			loadMore.classList.remove("opacity-0");
			loadMore.classList.add("opacity-70", "hover:opacity-100", "cursor-pointer");
		} else {
			loadMore.classList.add("opacity-0");
			loadMore.classList.remove("opacity-70", "hover:opacity-100", "cursor-pointer");
		}
	}
};

// When the load more button is clicked, render more books and hide the button
loadMore.addEventListener("click", () => {
	if (loadMore.classList.contains("opacity-70")) {
		loadMore.classList.add("opacity-0");
		loadMore.classList.remove("opacity-70", "hover:opacity-100", "cursor-pointer");
		renderBooks();
	}
});

// Update the start and end variables so that when load more is clicked again it loads the next 40 books
const sendVariables = async (start, end) => {
	try {
		const response = await fetch("/api/variables", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ start, end })
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error posting book indices:", error);
	}
};

// If the window is refreshed it resets the start and end variables using a POST request
window.addEventListener("beforeunload", () => {
	fetch("/api/variables", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ start: 0, end: 40 })
	});
});

// Search bar
const search = document.getElementById("search");

search.addEventListener("keyup", async (e) => {
	const text = e.target.value;

	const results = await searchBooks(text);

	const books = document.getElementById("books-container");

	books.innerHTML = "";

	results.forEach((book) => {
		createBookElement(book, books);
	});
});

const searchBooks = async (text) => {
	// If the text is undefined, return an empty array
	if (text === undefined) {
		return [];
	}

	try {
		const response = await fetch(`/api/search?book=${encodeURIComponent(text)}`);
		const books = await response.json();

		// Sort the books based on the similarity to the search text
		books.sort((a, b) => {
			const similarityA = calculateSimilarity(a.title, text);
			const similarityB = calculateSimilarity(b.title, text);

			// Sort in descending order of similarity
			return similarityB - similarityA;
		});

		return books;
	} catch (error) {
		console.error("Error fetching search results:", error);
		throw error;
	}
};

// Function to calculate the similarity between two strings
const calculateSimilarity = (str1, str2) => {
	// Convert both strings to lowercase
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();

	// Calculate the number of matching characters
	let matches = 0;
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] === str2[i]) {
			matches++;
		}
	}

	// Return the number of matches as the similarity
	return matches;
};

// Get references to the search icon and title
const searchIcon = document.getElementById("search-icon");
const title = document.getElementById("library-title");

searchIcon.addEventListener("click", () => {
	search.classList.toggle("hidden"); // Toggle the visibility of the search bar
	title.classList.toggle("hidden"); // Toggle the visibility of the title
	search.classList.toggle("w-4/5");
});

// |-------------------- Reviews page js --------------------|
// Load reviews
const loadReviews = async () => {
	try {
		const response = await fetch("/api/reviews");
		const reviews = await response.json();
		return reviews;
	} catch (error) {
		console.error("Error fetching reviews data:", error);
		throw error;
	}
};

// Display reviews
const renderReviews = async () => {
	const reviews = document.getElementById("reviews-container");
	reviews.innerHTML = "";

	try {
		const reviewsArray = await loadReviews();
		reviewsArray.forEach((review) => {
			createReviewElement(review, reviews);
		});
	} catch (error) {
		console.error("Error rendering the reviews:", error);
	}
};

const createReviewElement = (review, reviews) => {
	// Create the top bar
	const topBar = document.createElement("div");
	topBar.classList.add("h-1/5", "flex", "justify-between", "items-center", "pb-4");

	const right = document.createElement("div");
	right.classList.add("flex", "flex-row", "items-center", "justify-center");

	// Add the bin logo
	const bin = document.createElement("i");
	bin.classList.add("fa-solid", "fa-trash", "text-gray-500", "pr-4", "cursor-pointer");

	// Add an event listener to delete the review when clicked
	bin.addEventListener("click", async () => {
		// Ask if the user is sure they want to delete the review
		const confirmDelete = window.confirm("Are you sure you want to delete this review?");

		// If the user clicked OK, delete the review
		if (confirmDelete) {
			try {
				const response = await fetch("/api/reviews", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(review)
				});

				renderReviews();

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				} else {
					reviews.removeChild(reviewContainer); // Remove the review from the reviews
					const data = await response.text();
					console.log("Success:", data);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	});

	// Add the reviewer's name
	const reviewer = document.createElement("div");
	reviewer.classList.add("text-slate-400");
	reviewer.innerText = review.reviewer;

	right.appendChild(bin);
	right.appendChild(reviewer);

	// Add the rating
	const rating = document.createElement("div");
	rating.classList.add("flex", "flex-row", "items-center", "text-3xl", "no-select");
	const number = document.createElement("span");
	number.classList.add("pr-4");
	number.innerText = review.rating;
	rating.appendChild(number);
	for (let i = 0; i < Math.floor(review.rating); i++) {
		const star = document.createElement("i");
		star.classList.add("fa-solid", "fa-star", "text-yellow-400", "pr-4");
		rating.appendChild(star);
	}
	for (let i = 0; i < 5 - Math.floor(review.rating); i++) {
		const star = document.createElement("i");
		star.classList.add("fa-regular", "fa-star", "pr-4");
		rating.appendChild(star);
	}

	topBar.appendChild(rating);
	topBar.appendChild(right);

	// Add the review text
	const reviewText = document.createElement("div");
	reviewText.classList.add("h-4/5", "flex", "flex-col", "justify-between");
	const title = document.createElement("h1");
	title.classList.add("font-semibold", "text-xl", "pb-2");
	title.innerText = review.title;
	const text = document.createElement("p");
	text.classList.add("max-h-44", "overflow-y-scroll", "scrollbar");
	text.innerText = review.text;

	reviewText.appendChild(title);
	reviewText.appendChild(text);

	// Append the top bar and review text to the review container
	const reviewContainer = document.createElement("div");
	reviewContainer.classList.add("bg-white", "rounded-3xl", "w-[calc(100%-5px)]", "p-8", "max-h-80", "mb-4");
	reviewContainer.appendChild(topBar);
	reviewContainer.appendChild(reviewText);

	reviews.appendChild(reviewContainer);
};

renderReviews();

// Review form
const reviewSearch = document.getElementById("review-search");
const dropdown = document.getElementById("dropdown");

reviewSearch.addEventListener("keyup", async (e) => {
	const text = e.target.value;
	dropdown.innerHTML = "";

	const results = await searchBooks(text);

	results.forEach((book) => {
		if (dropdown.children.length < 5) {
			createReviewSearchElement(book);
		}
	});

	if (reviewSearch.value.length > 0) {
		dropdown.style.display = "block";
	} else {
		dropdown.style.display = "none";
	}
});

const createReviewSearchElement = (book) => {
	const container = document.createElement("div");
	container.classList.add(
		"flex",
		"justify-between",
		"items-center",
		"p-2",
		"hover:bg-gray-200",
		"transition-colors",
		"no-select",
		"cursor-pointer"
	);

	const title = document.createElement("span");
	title.innerText = book.title;
	container.appendChild(title);

	container.addEventListener("click", () => {
		if (book.title !== "No results found") {
			reviewSearch.value = book.title;
			dropdown.style.display = "none";
		}
	});

	dropdown.appendChild(container);
};

const reviewRating = document.getElementById("review-rating");
const stars = document.querySelectorAll(".stars");

stars.forEach((star, index) => {
	star.addEventListener("click", () => {
		reviewRating.value = index + 1;

		stars.forEach((star, index) => {
			if (index <= reviewRating.value - 1) {
				star.classList.remove("fa-regular");
				star.classList.add("fa-solid", "text-yellow-400");
			} else {
				star.classList.remove("fa-solid", "text-yellow-400");
				star.classList.add("fa-regular");
			}
		});
	});
});

// Adjust the stars depending on the number in the input box
reviewRating.addEventListener("keyup", () => {
	if (reviewRating.value.length > 1 && reviewRating.value[0] === "0" && reviewRating.value[1] !== ".") {
		reviewRating.value = reviewRating.value[reviewRating.value.length - 1];
	}

	if (reviewRating.value > 5) {
		reviewRating.value = 5;
	} else if (reviewRating.value < 0) {
		reviewRating.value = 0;
	}

	if (reviewRating.value === "") {
		reviewRating.value = 0;
	}

	if ((reviewRating.value * 10) % 1 !== 0) {
		const temp = Math.floor(reviewRating.value * 10);
		reviewRating.value = temp / 10;
	}

	stars.forEach((star, index) => {
		if (index <= reviewRating.value - 1) {
			star.classList.remove("fa-regular");
			star.classList.add("fa-solid", "text-yellow-400");
		} else {
			star.classList.remove("fa-solid", "text-yellow-400");
			star.classList.add("fa-regular");
		}
	});
});

const reviewForm = document.getElementById("add-review-form");

reviewForm.onsubmit = async (e) => {
	e.preventDefault();
	if (dropdown.style.display !== "none") {
		alert("Please enter a valid book title");
		return;
	}
	const data = new FormData(e.target);
	const review = Object.fromEntries(data.entries());
	try {
		const response = await fetch("/api/reviews", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(review)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			console.log("Review added successfully");
			reviewForm.reset();
			renderReviews();
		}
	} catch (error) {
		console.error("Error adding new review:", error);
	}
};

// |-------------------- Administrator page js --------------------|
// Book form
const form = document.getElementById("add-book-form");

form.onsubmit = async (e) => {
	e.preventDefault();
	const data = new FormData(e.target);
	const book = Object.fromEntries(data.entries());
	try {
		const response = await fetch("/api/books", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(book)
		});

		addBooktoLibrary(book);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			console.log("Book added successfully");
			form.reset();

			sendVariables(0, 40);

			document.getElementById("books-container").innerHTML = "";
			renderBooks();
			renderNewReleases();
		}
	} catch (error) {
		console.error("Error adding new book:", error);
	}
};

const addBooktoLibrary = (book) => {
	const books = document.getElementById("books-container");
	createBookElement(book, books);
};

// New release button
const newReleaseButton = document.getElementById("book-newrelease");
const newReleaseLabel = document.getElementById("new-release-label");
const newReleaseLabelText = document.getElementById("new-release-label-text");
const tick = document.getElementById("tick");

newReleaseButton.addEventListener("change", () => {
	if (newReleaseButton.checked) {
		newReleaseLabelText.classList.remove("text-slate-800");
		newReleaseLabelText.classList.add("text-blue-500");
		newReleaseLabel.classList.remove("border-gray-300");
		newReleaseLabel.classList.add("border-blue-500");
		tick.classList.remove("opacity-0");
		tick.classList.add("opacity-100");
	} else {
		newReleaseLabelText.classList.remove("text-blue-500");
		newReleaseLabelText.classList.add("text-slate-800");
		newReleaseLabel.classList.remove("border-blue-500");
		newReleaseLabel.classList.add("border-gray-300");
		tick.classList.remove("opacity-100");
		tick.classList.add("opacity-0");
	}
});
