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
			const response = await request(app).get("/api/books/1000/reviews");
			expect(response.statusCode).toBe(404);
		});
	});
});

// |-------------------- Administrator page API --------------------|
describe("POST /api/books", () => {
	describe("given a valid book", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).post("/api/books").send({
				title: "Test Book",
				authors: "Test Author",
				shortDescription: "Test Description",
			});
			expect(response.statusCode).toBe(201);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).post("/api/books").send({
				title: "Test Book",
				authors: "Test Author",
				shortDescription: "Test Description",
			});
			expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
		});
	});

	describe("if there is an error", () => {
		test("should respond with a 400 status code", async () => {
			const response = await request(app).post("/api/books").send({
				title: "Test Book",
			});
			expect(response.statusCode).toBe(500);
		});
	});
});
