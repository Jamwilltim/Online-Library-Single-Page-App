// Import the necessary modules
const request = require("supertest");
const app = require("./app");

// |-------------------- Home page API --------------------|
describe("GET /api/newreleases", () => {
	describe("if there are new releases", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/newreleases");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/newreleases");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no new releases", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/newreleases");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("GET /api/favourites", () => {
	describe("if there are favourites", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/favourites");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/favourites");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no favourites", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/favourites");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("GET /api/books/length", () => {
	describe("if there are books", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/books/length");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/books/length");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no books", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/books/length");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

// |-------------------- Library page API --------------------|
describe("GET /api/books/:id", () => {
	describe("if the book exists", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/books/1");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/books/1");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/books/1000");
			expect(response.statusCode).toBe(404);
		});
	});
});

describe("GET /api/books/:id/reviews", () => {
	describe("if the book has some reviews", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/books/1/reviews");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/books/1/reviews");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if the book does not have any reviews", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/books/129/reviews");
			expect(response.statusCode).toBe(404);
		});
	});

	describe("if the book does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/books/1000/reviews");
			expect(response.statusCode).toBe(404);
		});
	});
});

describe("GET /api/books", () => {
	describe("if there are books", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/books");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/books");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});

		test("the length of the response should be less than or equal to 40", async () => {
			const response = await request(app).get("/api/books");
			expect(response.body.length).toBeLessThanOrEqual(40);
		});
	});

	describe("if there are no books", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/books");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

describe("GET /api/variables", () => {
	describe("if there are variables", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/variables");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/variables");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});

		test("difference in variables should be less than or equal to 40", async () => {
			const response = await request(app).get("/api/variables");
			expect(response.body.end - response.body.start).toBeLessThanOrEqual(40);
		});
	});

	describe("if there are no variables", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/variables");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

// describe("POST /api/variables", () => {
// 	describe("if start or end is undefined", () => {
// 		test("should respond with a 404 status code", async () => {
// 			const response = await request(app).post("/api/variables").send({
// 				start: 50,
// 			});
// 			expect(response.statusCode).toBe(404);
// 		});
// 	});

// 	describe("if start and end are defined", () => {
// 		describe("if start is greater than end", () => {
// 			test("should respond with a 400 status code", async () => {
// 				const response = await request(app).post("/api/variables").send({
// 					start: 100,
// 					end: 50,
// 				});
// 				expect(response.statusCode).toBe(400);
// 			});
// 		});

// 		describe("if start or end is negative", () => {
// 			test("should respond with a 400 status code", async () => {
// 				const response = await request(app).post("/api/variables").send({
// 					start: -1,
// 					end: 50,
// 				});
// 				expect(response.statusCode).toBe(400);
// 			});
// 		});

// 		describe("if start or end is greater than the number of books", () => {
// 			test("should respond with a 400 status code", async () => {
// 				const response = await request(app).post("/api/variables").send({
// 					start: 1000,
// 					end: 50,
// 				});
// 				expect(response.statusCode).toBe(400);
// 			});
// 		});

// 		describe("if start or end is not a number", () => {
// 			test("should respond with a 400 status code", async () => {
// 				const response = await request(app).post("/api/variables").send({
// 					start: "a",
// 					end: 50,
// 				});
// 				expect(response.statusCode).toBe(400);
// 			});
// 		});

// 		describe("if start and end are valid", () => {
// 			test("should respond with a 200 status code", async () => {
// 				const response = await request(app).post("/api/variables").send({
// 					start: 50,
// 					end: 100,
// 				});
// 				expect(response.statusCode).toBe(200);
// 			});

// 			test("should specify json in the content type header", async () => {
// 				const response = await request(app).post("/api/variables").send({
// 					start: 50,
// 					end: 100,
// 				});
// 				expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
// 			});
// 		});
// 	});
// });

describe("GET /api/search", () => {
	describe("if there are books", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/search").query({ book: "Unlocking Android" });
			expect(response.statusCode).toBe(200);
		});
	});

	describe("if there are no books", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/search").query({ book: "" });
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

// |-------------------- Reviews page API --------------------|

describe("GET /api/reviews", () => {
	describe("if there are reviews", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get("/api/reviews");
			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get("/api/reviews");
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there are no reviews", () => {
		test("should respond with a 404 status code", async () => {
			const response = await request(app).get("/api/reviews");
			if (response.body.length === 0) {
				expect(response.statusCode).toBe(404);
			}
		});
	});
});

// |-------------------- Administrator page API --------------------|

describe("Post methods", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.mock("fs", () => ({
			promises: {
				readFile: jest.fn().mockRejectedValue(new Error("Failed to read file")),
				writeFile: jest.fn().mockResolvedValue(),
			},
		}));
	});

	describe("POST /api/books", () => {
		test("should respond with a 200 status code if readFile succeeds", async () => {
			const fs = require("fs").promises;
			jest.isolateModules(async () => {
				// Require fs inside the test

				// Mock fs.promises.readFile to resolve with a JSON string
				fs.readFile.mockResolvedValue(JSON.stringify([{ _id: 1 }]));

				// Make your request and check the response
				const response = await request(app).post("/api/books").set("Content-Type", "application/json");
				expect(response.statusCode).toBe(200);

				// Check that fs.readFile has been called
				expect(fs.readFile).toHaveBeenCalledTimes(1);
				expect(fs.writeFile).toHaveBeenCalledTimes(1);
			});
		});

		test("should respond with a 500 status code if readFile fails", async () => {
			jest.isolateModules(async () => {
				const response = await request(app).post("/api/books").set("Content-Type", "application/json").send({ title: "Mock Book" });

				expect(response.statusCode).toBe(500);
			});
		});
	});

	describe("POST /api/updateFavourite/:id", () => {
		describe("if the book does not exist", () => {
			test("should respond with a 404 status code", async () => {
				const fs = require("fs").promises;
				jest.isolateModules(async () => {
					// Mock fs.promises.readFile to resolve with a JSON string
					fs.readFile.mockResolvedValue(JSON.stringify([{ _id: 1 }]));

					const response = await request(app).post("/api/updateFavourite/1000").set("Content-Type", "application/json").send({
						favourited: true,
					});

					expect(response.statusCode).toBe(404);
					expect(fs.readFile).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe("if the book exists", () => {
			test("should respond with a 200 status code", async () => {
				const fs = require("fs").promises;
				jest.isolateModules(async () => {
					// Mock fs.promises.readFile to resolve with a JSON string
					fs.readFile.mockResolvedValue(JSON.stringify([{ _id: 1 }]));

					const response = await request(app).post("/api/updateFavourite/1").set("Content-Type", "application/json").send({
						favourited: true,
					});

					expect(response.statusCode).toBe(200);
					expect(fs.readFile).toHaveBeenCalledTimes(1);
					expect(fs.writeFile).toHaveBeenCalledTimes(1);
				});
			});
		});
	});
});
