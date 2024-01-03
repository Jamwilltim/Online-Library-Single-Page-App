// Page switcher
const getCurrentPage = () => {
	return window.location.href.split("/").pop().split("#").pop();
};

const menuButtons = document.querySelectorAll(".sidebar-buttons");
const pages = document.querySelectorAll(".main-page");

const changeActiveButton = (newActiveButtonId) => {
	let activeButton = document.querySelector(".active-button");
	if (activeButton) {
		activeButton.classList.remove("active-button");
	}
	let newActiveButton = document.getElementById(newActiveButtonId);
	if (newActiveButton) {
		newActiveButton.classList.add("active-button");
	}
};

menuButtons.forEach((e) => {
	e.addEventListener("click", () => {
		changeActiveButton(e.id);
		changePages();
	});
});

const changePages = () => {
	let currentPage = getCurrentPage();
	for (let i = 0; i < pages.length; i++) {
		if (menuButtons[i].id == currentPage.concat("-button")) {
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

window.onhashchange = () => {
	changeActiveButton(getCurrentPage().concat("-button"));
	changePages();
};

changeActiveButton(getCurrentPage().concat("-button"));
changePages();

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
			title.classList.add("font-bold");
			title.innerText = book.title;
			const author = document.createElement("p");
			author.classList.add("w-2/3", "text-center");
			author.innerText = book.authors;
			const newRelease = document.createElement("div");
			newRelease.classList.add("flex", "justify-center", "flex-col", "items-center", "h-5/6");
			newRelease.appendChild(imageContainer);
			newRelease.appendChild(title);
			newRelease.appendChild(author);
			newReleases.appendChild(newRelease);
		});
	} catch (error) {
		console.error("Error rendering the new release images:", error);
	}
};

renderNewReleases();

// Digit spinner for the number of books sold in the last year
const refresh = document.getElementById("refresh-button");

let numberBooksLoaned = 4560000;

const digits = document.getElementsByClassName("digit");

refresh.addEventListener("click", () => {
	refreshnumberBooksLoaned(numberBooksLoaned);
});

const displaynumberBooksLoaned = (num) => {
	const numArray = Array.from(String(num), Number);
	for (let i = 0; i < digits.length; i++) {
		let digit = digits[i];
		let index = numArray[i];
		digit.style.translate = `0 -${45 * (10 * i + index)}px`;
	}
};

const refreshnumberBooksLoaned = (num) => {
	const numArray = Array.from(String(num), Number);
	for (let i = 0; i < digits.length; i++) {
		let digit = digits[i];
		let index = numArray[i];
		digit.style.transitionDuration = "0s";
		digit.style.translate = `0 0`;
		setTimeout(() => {
			digit.style.transitionDuration = "2s";
			digit.style.translate = `0 -${45 * (10 * i + index)}px`;
		}, 1);
	}
};

displaynumberBooksLoaned(numberBooksLoaned);

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
		sendVariables(); // Send the updated start and end variables to the server
	} catch (error) {
		console.error("Error rendering the books:", error);
	}
};

const createBookElement = (book, books) => {
	// Create the image element
	const image = document.createElement("img");
	image.src = book.thumbnailUrl;
	image.alt = "Book Thumbnail";
	image.classList.add("h-[188px]");

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
	bookFront.classList.add("flex", "flex-col", "justify-around", "items-center", "h-full");
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
	buttons.classList.add("flex", "justify-between", "w-full", "mb-4");

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
					"Content-Type": "application/json",
				},
				body: JSON.stringify(book),
			});

			const data = await response.text();
			console.log("Success:", data);
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
						"Content-Type": "application/json",
					},
					body: JSON.stringify(book),
				});

				renderBooks();

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
	description.classList.add("text-center", "w-full", "text-black");
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
		"h-5/6",
		"bg-white",
		"rounded-3xl",
		"p-4",
		"m-4",
		"w-60",
		"h-80",
		"cursor-pointer"
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
const booksContainer = document.getElementById("books-container");

loadMore.classList.add("opacity-0"); // Hide the load more button

// When the user scrolls to the bottom of the page, show the load more button
booksContainer.onscroll = () => {
	if (booksContainer.scrollTop + booksContainer.clientHeight >= booksContainer.scrollHeight - 10) {
		loadMore.classList.remove("opacity-0");
		loadMore.classList.add("opacity-70", "hover:opacity-100", "cursor-pointer");
	} else {
		loadMore.classList.add("opacity-0");
		loadMore.classList.remove("opacity-70", "hover:opacity-100", "cursor-pointer");
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
const sendVariables = async () => {
	try {
		start += 40;
		end += 40;

		const response = await fetch("/api/variables", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ start, end }),
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
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ start: 0, end: 40 }),
	});
});

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
				"Content-Type": "application/json",
			},
			body: JSON.stringify(book),
		});

		addBooktoLibrary(book);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			console.log("Book added successfully");
			form.reset();
		}
	} catch (error) {
		console.error("Error adding new book:", error);
	}
};

const addBooktoLibrary = (book) => {
	const books = document.getElementById("books-container");
	createBookElement(book, books);
};
