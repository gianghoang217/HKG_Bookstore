
from flask import Blueprint, jsonify, request, send_from_directory, url_for
from models import db, Book
import json
from werkzeug.utils import secure_filename
import os
from auth import admin_required 
books_bp = Blueprint('books', __name__)


@books_bp.route('/static/uploads/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/uploads', filename)


# Get All Books
@books_bp.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([{
        "id": b.id,
        "title": b.title,
        "author": b.author,
        "price": b.price,
        "description": b.description,
        "image_url": b.image_filename
    } for b in books])

# Get Single Book
@books_bp.route('/book/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get(id)
    if book:
        return jsonify({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "price": book.price,
            "description": book.description
        })
    return jsonify({"error": "Book not found"}), 404


UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@books_bp.route('/book/add', methods=['POST'])
@admin_required
def add_book():
    data = request.get_json()
    print("Check Data", data)
    title = data['title']
    author = data['author']
    price = data['price']
    description = data['description']
    image_filename = data['image_filename']

    new_book = Book(
        title=title,
        author=author,
        price=price,
        description=description,
        image_filename=image_filename
    )

    db.session.add(new_book)
    db.session.commit()

    return jsonify({"message": "Book added successfully"}), 201

# Update Book
@books_bp.route('/book/update/<int:id>', methods=['PUT'])
@admin_required
def update_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.price = data.get('price', book.price)
    book.description = data.get('description', book.description)
    book.image_filename = data.get('image_filename', book.image_filename)

    db.session.commit()
    return jsonify({"message": "Book updated successfully"}), 200

# Delete Book
@books_bp.route('/book/delete/<int:id>', methods=['DELETE'])
@admin_required
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200
