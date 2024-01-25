// Import the necessary modules
const request = require("supertest");
const test = require("./test/testing");

// |-------------------- Home page API --------------------|
describe("GET /api/newreleases", () => {
	describe("if there are new releases", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/newreleases");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/newreleases");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no new releases", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/newreleases");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("GET /api/favourites", () => {
	describe("if there are favourites", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/favourites");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/favourites");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no favourites", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/favourites");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("GET /api/books/length", () => {
	describe("if there are books", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/books/length");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/books/length");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no books", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/books/length");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

// |-------------------- Library page API --------------------|
describe("GET /api/books/:id", () => {
	describe("if the book exists", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/books/1");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/books/1");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book does not exist", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/books/1000");
			expect(response.statusCode).toBe(404);
		});
	});
});

describe("GET /api/books/:id/reviews", () => {
	describe("if the book has some reviews", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/books/1/reviews");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/books/1/reviews");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book does not have any reviews", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/books/150/reviews");
			expect(response.statusCode).toBe(404);
		});
	});

	describe("if the book does not exist", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/books/1000/reviews");
			expect(response.statusCode).toBe(404);
		});
	});
});

describe("GET /api/books", () => {
	describe("if there are books", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/books");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/books");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});

		it("the length of the response should be less than or equal to 40", async () => {
			const response = await request(test).get("/api/books");
			expect(response.body.length).toBeLessThanOrEqual(40);
		});
	});

	describe("if there are no books", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/books");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("GET /api/variables", () => {
	describe("if there are variables", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/variables");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/variables");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});

		it("difference in variables should be less than or equal to 40", async () => {
			const response = await request(test).get("/api/variables");
			expect(response.body.end - response.body.start).toBeLessThanOrEqual(40);
		});
	});

	describe("if there are no variables", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/variables");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("POST /api/variables", () => {
	describe("if start or end is undefined", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).post("/api/variables").send({
				start: 50,
			});
			expect(response.statusCode).toBe(404);
		});
	});

	describe("if start and end are defined", () => {
		describe("if start is greater than end", () => {
			it("should respond with a 400 status code", async () => {
				const response = await request(test).post("/api/variables").send({
					start: 100,
					end: 50,
				});
				expect(response.statusCode).toBe(400);
			});
		});

		describe("if start or end is negative", () => {
			it("should respond with a 400 status code", async () => {
				const response = await request(test).post("/api/variables").send({
					start: -1,
					end: 50,
				});
				expect(response.statusCode).toBe(400);
			});
		});

		describe("if start or end is greater than the number of books", () => {
			it("should respond with a 400 status code", async () => {
				const response = await request(test).post("/api/variables").send({
					start: 1000,
					end: 50,
				});
				expect(response.statusCode).toBe(400);
			});
		});

		describe("if start or end is not a number", () => {
			it("should respond with a 400 status code", async () => {
				const response = await request(test).post("/api/variables").send({
					start: "a",
					end: 50,
				});
				expect(response.statusCode).toBe(400);
			});
		});

		describe("if start and end are valid", () => {
			it("should respond with a 200 status code", async () => {
				const response = await request(test).post("/api/variables").send({
					start: 50,
					end: 100,
				});
				expect(response.statusCode).toBe(200);
			});

			it("should specify json in the content type header", async () => {
				const response = await request(test).post("/api/variables").send({
					start: 50,
					end: 100,
				});
				expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
			});
		});
	});
});

describe("GET /api/search", () => {
	describe("if there are books", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/search").query({ book: "Unlocking Android" });
			expect(response.statusCode).toBe(200);
		});
	});

	describe("if there are no books", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/search").query({ book: "" });
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("DELETE /api/books/:id", () => {
	describe("if the book exists", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).delete("/api/books/1");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).delete("/api/books/1");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book does not exist", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).delete("/api/books/1000");
			expect(response.statusCode).toBe(404);
		});
	});
});

describe("POST /api/updateFavourite/:id", () => {
	describe("if the book exists", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).post("/api/updateFavourite/1").send({
				favourited: true,
			});
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).post("/api/updateFavourite/1").send({
				favourited: true,
			});
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book does not exist", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).post("/api/updateFavourite/1000").send({
				favourited: true,
			});
			expect(response.statusCode).toBe(404);
		});
	});
});

// |-------------------- Reviews page API --------------------|

describe("GET /api/reviews", () => {
	describe("if there are reviews", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).get("/api/reviews");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).get("/api/reviews");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no reviews", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).get("/api/reviews");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("POST /api/reviews", () => {
	describe("if the review is valid", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).post("/api/reviews").send({
				reviewer: "John Doe",
				rating: 5,
				text: "This is a test comment",
				title: "Flex on Java",
			});
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).post("/api/reviews").send({
				reviewer: "John Doe",
				rating: 5,
				text: "This is a test comment",
				title: "Flex on Java",
			});
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the review is invalid", () => {
		describe("if the id is undefined", () => {
			it("should respond with a 404 status code", async () => {
				const response = await request(test).post("/api/reviews").send({
					name: "John Doe",
					rating: 5,
					comment: "This is a test comment",
				});
				expect(response.statusCode).toBe(404);
			});
		});
	});
});

describe("DELETE /api/reviews/:id", () => {
	describe("if the review exists", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).delete("/api/reviews/110");
			expect(response.statusCode).toBe(200);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).delete("/api/reviews/111");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the review does not exist", () => {
		it("should respond with a 404 status code", async () => {
			const response = await request(test).delete("/api/reviews/ten");
			expect(response.statusCode).toBe(404);
		});
	});
});

// |-------------------- Administrator page API --------------------|

describe("POST /api/books", () => {
	describe("if the book is valid", () => {
		it("should respond with a 200 status code", async () => {
			const response = await request(test).post("/api/books").send({
				title: "Test Book",
				authors: "John Doe",
				shortDescription: "This is a test book",
				newrelease: true,
			});
			expect(response.statusCode).toBe(201);
		});

		it("should specify json in the content type header", async () => {
			const response = await request(test).post("/api/books").send({
				title: "Test Book",
			});
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book is invalid", () => {
		describe("if the title is undefined", () => {
			it("should respond with a 404 status code", async () => {
				const response = await request(test).post("/api/books").send({
					title: "Test Book",
				});
				expect(response.statusCode).toBe(500);
			});
		});
	});
});
