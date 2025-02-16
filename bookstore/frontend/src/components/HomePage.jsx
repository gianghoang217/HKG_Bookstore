import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <Navbar />
            
            <div className="main">
                <div style={{ textAlign: 'center' }}>
                    <img src="/assets/images/reading.png" alt="Home" style={{ width: '1500px', height: 'auto' }} />
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5em', color: '#333', lineHeight: '1.2', fontStyle: 'italic', opacity: '0.8' }}>The world belongs to those who read!</h2>
                    
                    <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.2em', color: '#666', lineHeight: '1.5' }}>Let's find something to read!</p>
                    <Link to="/shopping" style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '10px 20px', fontSize: '1em', borderRadius: '5px', backgroundColor: '#f0c14b', border: '1px solid #a88734', cursor: 'pointer' }}>Browse Books</button>
                    </Link>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default HomePage;
