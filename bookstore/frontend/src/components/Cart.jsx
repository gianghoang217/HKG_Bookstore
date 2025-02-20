import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from './Navbar';
import Footer from './Footer';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('access_token') !== null;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchCartItems();
    }, [isLoggedIn, navigate]);

    const fetchCartItems = async () => {
        try {
            const response = await API.get('/cart/details');
            setCartItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Failed to load cart items');
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        try {
            await API.put(`/cart/${cartId}`, { quantity: newQuantity });
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (cartId) => {
        try {
            await API.delete(`/cart/${cartId}`);
            fetchCartItems(); // Refresh cart after removal
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => 
            total + (item.book.price * item.quantity), 0
        ).toFixed(2);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (        
        <div className="cart-page">
            <Navbar />
            <div className="cart-content">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button onClick={() => navigate('/shopping')}>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.cart_id} className="cart-item">
                                <img 
                                    src={item.book.image_url} 
                                    alt={item.book.title}
                                    className="book-picture"
                                />
                                <div className="item-details">
                                    <h3>{item.book.title}</h3>
                                    <p>by {item.book.author}</p>
                                    <p className="price">${item.book.price}</p>
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeItem(item.cart_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <div className="total">
                            <span>Total:</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
            </div>

            <Footer />
        </div>
    );
};

export default Cart;