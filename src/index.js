const menuButtons = document.querySelectorAll(".sidebar-button");
const pages = document.querySelectorAll(".main-page");

menuButtons.forEach(function (e) {
	e.addEventListener("click", function () {
		if (!e.classList.contains("active-button")) {
			let activeButton = document.getElementById("active-button");
			activeButton.id = "";
			e.id = "active-button";
		}
		changePages();
	});
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

function jump() {
	console.log("jump");
}
