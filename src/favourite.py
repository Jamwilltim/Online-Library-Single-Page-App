import json
import random

# Load the data from the existing JSON file
with open("./src/books.json", "r") as f:
    books = json.load(f)

# Add a 'favourited' property to every book and set it to False
for book in books:
    book["favourited"] = False

# Randomly select 10 books and set 'favourited' to True
random.sample(books, 10)

for book in random.sample(books, 10):
    book["favourited"] = True

# Write the updated data to a new JSON file
with open("books_updated.json", "w") as f:
    json.dump(books, f, indent=2)
