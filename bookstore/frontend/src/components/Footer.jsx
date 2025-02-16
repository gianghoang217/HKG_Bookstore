import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/shopping" className="footer-link">Shop</Link>                    
                </div>
                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Email: info@hkgbookstore.com</p>
                    <p>Phone: (555) 123-4567</p>
                </div>
                <div className="footer-section">
                    <h3>Newsletter</h3>
                    <div className="newsletter">
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button className="subscribe-btn">Subscribe</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;