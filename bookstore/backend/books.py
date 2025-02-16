from flask import Blueprint, jsonify, request, send_from_directory, url_for
from models import db, Book
import json
from werkzeug.utils import secure_filename
import os
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
        "image_url": url_for('books.serve_image', filename=b.image_filename, _external=True) if b.image_filename else None
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
def add_book():
    data = None
    image_filename = None

    if "image" in request.files:  # Image uploaded
        image = request.files["image"]
        json_data = request.form.get("json")

        if not json_data:
            return jsonify({"error": "Missing book data"}), 400

        try:
            data = json.loads(json_data)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON data"}), 400

        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            image.save(image_path)
            image_filename = filename  # Save filename in DB

    else:  # No image uploaded, handle JSON request
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

    new_book = Book(
        title=data['title'],
        author=data['author'],
        price=data['price'],
        description=data.get('description', ''),
        image_filename=image_filename or data.get("image_filename")
    )

    db.session.add(new_book)
    db.session.commit()

    return jsonify({"message": "Book added successfully"}), 201

# Update Book
@books_bp.route('/book/update/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.price = data.get('price', book.price)
    book.description = data.get('description', book.description)

    db.session.commit()
    return jsonify({"message": "Book updated successfully"}), 200

# Delete Book
@books_bp.route('/book/delete/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200
