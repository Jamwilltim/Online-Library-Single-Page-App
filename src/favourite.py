import json

# Load the data from the existing JSON file
with open("./src/books.json", "r") as f:
    books = json.load(f)

# Reorder the '_id' attributes of the books from 1 upwards
for i, book in enumerate(books, start=1):
    book["_id"] = i

# Write the updated data to a new JSON file
with open("./src/books_updated.json", "w") as f:
    json.dump(books, f, indent=2)
