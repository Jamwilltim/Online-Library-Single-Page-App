const menuButtons = document.querySelectorAll(".sidebar-button");
const pages = document.querySelectorAll(".main-page");

const digits = document.getElementsByClassName("digit");

let houses = 4560000;

menuButtons.forEach(function (e) {
	e.addEventListener("click", function () {
		let activeButton = document.getElementById("active-button");
		activeButton.id = "";
		e.id = "active-button";
		changePages();
	});
});

const refresh = document.getElementById("refresh-button");

refresh.addEventListener("click", function () {
	refreshHouses(houses);
});

function changePages() {
	for (let i = 0; i < pages.length; i++) {
		if (menuButtons[i].id == "") {
			if (pages[i].classList.contains("opacity-100")) {
				pages[i].classList.remove("opacity-100");
				pages[i].classList.add("opacity-0");
			}
		} else if (pages[i].classList.contains("opacity-0")) {
			pages[i].classList.remove("opacity-0");
			pages[i].classList.add("opacity-100");
		}
	}
}

function displayHouses(num) {
	const numArray = Array.from(String(num), Number);
	for (let i = 0; i < digits.length; i++) {
		let digit = digits[i];
		let index = numArray[i];
		digit.style.translate = `0 -${45 * (10 + index)}px`;
	}
}

const refreshHouses = async (num) => {
	const numArray = Array.from(String(num), Number);
	for (let i = 0; i < digits.length; i++) {
		let digit = digits[i];
		let index = numArray[i];
		digit.style.transitionDuration = "0s";
		digit.style.translate = `0 0`;
		setTimeout(() => {
			digit.style.transitionDuration = "2s";
			digit.style.translate = `0 -${45 * (10 + index)}px`;
		}, 1);
	}
};

displayHouses(houses);
