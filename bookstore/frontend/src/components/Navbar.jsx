import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, User } from 'lucide-react';
import API from '../api';
import './Navbar.css';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('access_token') !== null;

    useEffect(() => {
        const fetchCartCount = async () => {
            if (isLoggedIn) {
                try {
                    const response = await API.get('/cart');
                    // Sum up all quantities in the cart
                    const totalCount = response.data.reduce((sum, item) => sum + item.quantity, 0);
                    setCartCount(totalCount);
                } catch (error) {
                    console.error('Error fetching cart count:', error);
                    setCartCount(0);
                }
            } else {
                setCartCount(0);
            }
        };

        fetchCartCount();
        // Set up an interval to refresh cart count periodically
        const interval = setInterval(fetchCartCount, 3000); // Updates every 3 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setShowDropdown(false);
        setCartCount(0);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">
                    <BookOpen className="icon" />
                    <span className="brand">HKG Book Store</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/shopping" className="nav-link">Shop</Link>
                    <Link to="/about" className="nav-link">About Us</Link>
                    
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="nav-link">Sign In</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    ) : (
                        <div className="profile-container">
                            <User 
                                className="profile-icon" 
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                            {showDropdown && (
                                <div className="profile-dropdown">
                                    <button onClick={handleSignOut}>Sign Out</button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <Link to="/cart" className="nav-link cart-link">
                        <div className="cart-icon-container">
                            <ShoppingCart className="cart-icon" />
                            <span className="cart-count">{cartCount}</span>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;