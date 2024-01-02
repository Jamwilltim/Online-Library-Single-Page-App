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

// Display books in library
const loadBooks = async () => {
	try {
		const response = await fetch("/api/books");
		const books = await response.json();
		return books;
	} catch (error) {
		console.error("Error fetching books data:", error);
		throw error;
	}
};

const renderBooks = async () => {
	const books = document.getElementById("books-container");
	const variablesResponse = await fetch("/api/variables");
	const variables = await variablesResponse.json();
	let start = variables.start;
	let end = variables.end;
	try {
		const booksArray = await loadBooks();
		booksArray.forEach((book) => {
			const image = document.createElement("img");
			image.src = book.thumbnailUrl;
			image.alt = "Book Thumbnail";
			image.classList.add("h-[188px]");
			const imageContainer = document.createElement("div");
			imageContainer.classList.add("pb-2");
			imageContainer.appendChild(image);
			const title = document.createElement("h3");
			title.classList.add("font-bold", "text-center", "w-full");
			title.innerText = book.title;
			const author = document.createElement("p");
			author.classList.add("w-2/3", "text-center", "w-full");
			author.innerText = book.authors;
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
				"h-80"
			);
			bookContainer.id = "books-container";
			bookContainer.appendChild(imageContainer);
			bookContainer.appendChild(title);
			bookContainer.appendChild(author);
			books.appendChild(bookContainer);
		});
		sendVariables(start, end);
	} catch (error) {
		console.error("Error rendering the books:", error);
	}
};

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

loadMore.classList.add("opacity-0");

booksContainer.onscroll = () => {
	if (booksContainer.scrollTop + booksContainer.clientHeight >= booksContainer.scrollHeight - 10) {
		loadMore.classList.remove("opacity-0");
		loadMore.classList.add("opacity-70", "hover:opacity-100", "cursor-pointer");
	} else {
		loadMore.classList.add("opacity-0");
		loadMore.classList.remove("opacity-70", "hover:opacity-100", "cursor-pointer");
	}
};

loadMore.addEventListener("click", () => {
	if (loadMore.classList.contains("opacity-70")) {
		loadMore.classList.add("opacity-0");
		loadMore.classList.remove("opacity-70", "hover:opacity-100", "cursor-pointer");
		renderBooks();
	}
});

const sendVariables = async (start, end) => {
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
	console.log("Page unloaded");
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
		renderBooks();
		addBooktoLibrary(book);
		renderBooks();
		console.log("Book added successfully");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error adding new book:", error);
	}
};

const addBooktoLibrary = (book) => {
	const image = document.createElement("img");
	image.src = book.thumbnailUrl;
	image.alt = "Book Thumbnail";
	image.classList.add("h-[188px]");
	const imageContainer = document.createElement("div");
	imageContainer.classList.add("pb-2");
	imageContainer.appendChild(image);
	const title = document.createElement("h3");
	title.classList.add("font-bold", "text-center", "w-full");
	title.innerText = book.title;
	const author = document.createElement("p");
	author.classList.add("w-2/3", "text-center", "w-full");
	author.innerText = book.authors;
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
		"h-80"
	);
	bookContainer.appendChild(imageContainer);
	bookContainer.appendChild(title);
	bookContainer.appendChild(author);
	booksContainer.appendChild(bookContainer);

	const books = document.getElementById("books-container");
	books.appendChild(bookContainer);
};
