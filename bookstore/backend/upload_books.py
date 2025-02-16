import requests
import json
import os

API_URL = "http://127.0.0.1:5000/book/add"

if __name__ == '__main__':
    try:
        with open("books.json", "r") as file:
            books = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error loading books.json: {e}")
        exit(1)

    for book in books:
        data = {
            "title": book["title"],
            "author": book["author"],
            "price": book["price"],
            "description": book.get("description", ""),
            "image_filename": book.get("image_filename", "")  # Ensure filename is included
        }

        response = requests.post(API_URL, json=data)

        if response.status_code == 201:
            print(f"✅ Successfully added: {book['title']}")
        else:
            print(f"❌ Failed to add: {book['title']} | Error: {response.text}")
