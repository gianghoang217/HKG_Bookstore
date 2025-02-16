from flask import Blueprint, request, jsonify, send_from_directory, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CartItem, Book
import logging
logger = logging.getLogger(__name__)
cart_bp = Blueprint('cart', __name__)


# Add Book to Cart (Only for Logged-In Users with JWT)
@cart_bp.route('/cart/add', methods=['POST'])
@jwt_required()  # Requires JWT token
def add_to_cart():
    logger.info('Before check user_id')
    user_id = get_jwt_identity()  # Get user ID from JWT token
    logger.info('CHECK user_id', user_id)
    data = request.get_json()
    book = Book.query.get(data['id'])

    if not book:
        return jsonify({"error": "Book not found"}), 404

    cart_item = CartItem.query.filter_by(user_id=user_id, book_id=book.id).first()

    if cart_item:
        cart_item.quantity += data.get('quantity', 1)
    else:
        cart_item = CartItem(user_id=user_id, book_id=book.id, quantity=data.get('quantity', 1))
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message": "Book added to cart"}), 201


# View Cart (Only for Logged-In Users with JWT)
@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def view_cart():
    user_id = get_jwt_identity()

    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    cart_data = [{
        "id": c.id,
        "book_id": c.book_id,
        "quantity": c.quantity
    } for c in cart_items]

    return jsonify(cart_data)

@cart_bp.route('/static/uploads/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/uploads', filename)

@cart_bp.route('/cart/details', methods=['GET'])
@jwt_required()
def view_cart_details():
    user_id = get_jwt_identity()

    # Join CartItem with Book to get book details
    cart_items = db.session.query(CartItem, Book)\
        .join(Book, CartItem.book_id == Book.id)\
        .filter(CartItem.user_id == user_id)\
        .all()

    cart_data = [{
        "cart_id": item.CartItem.id,
        "quantity": item.CartItem.quantity,
        "book": {
            "id": item.Book.id,
            "title": item.Book.title,
            "author": item.Book.author,
            "price": item.Book.price,
            "image_url": url_for('cart.serve_image', filename=item.Book.image_filename, _external=True) if item.Book.image_filename else None,
            "description": item.Book.description
        }
    } for item in cart_items]

    return jsonify(cart_data)

@cart_bp.route('/cart/<int:cart_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(cart_id):
    user_id = get_jwt_identity()  # Get user ID from JWT token
    data = request.get_json()
    new_quantity = data.get('quantity')

    # Find the cart item
    cart_item = CartItem.query.filter_by(id=cart_id, user_id=user_id).first()

    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404

    # Update the quantity
    if new_quantity <= 0:
        return jsonify({"error": "Quantity must be greater than zero"}), 400

    cart_item.quantity = new_quantity
    db.session.commit()

    return jsonify({"message": "Cart item updated successfully"}), 200

@cart_bp.route('/cart/<int:cart_id>', methods=['DELETE'])
@jwt_required()
def remove_cart_item(cart_id):
    user_id = get_jwt_identity()  # Get user ID from JWT token

    # Find the cart item
    cart_item = CartItem.query.filter_by(id=cart_id, user_id=user_id).first()

    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404

    # Remove the cart item
    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({"message": "Cart item removed successfully"}), 200


# Checkout (Only for Logged-In Users with JWT)
@cart_bp.route('/cart/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()

    user_cart_items = CartItem.query.filter_by(user_id=user_id).all()

    if not user_cart_items:
        return jsonify({"error": "Your cart is empty"}), 400

    total_price = sum([item.quantity * Book.query.get(item.book_id).price for item in user_cart_items])

    # Simulate Order Completion
    db.session.query(CartItem).filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({"message": "Order placed successfully", "total_price": total_price}), 200
