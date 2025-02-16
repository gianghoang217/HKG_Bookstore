import React from 'react';
import Navbar from './Navbar'
import Footer from './Footer'
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-page">
            <Navbar />
            <div className='about-us'>
            <img src="/assets/images/giang_profile.jpeg" alt="Founder" className="profile-pic" />
            <p>Hello! I'm Giang, the founder of HKG Book Store. As an avid reader and tech enthusiast, I wanted to create a platform where book lovers can find and explore great books effortlessly. My goal is to build a welcoming community of readers who share a love for literature.</p>

                       
            <h2>Our Story</h2>
            <p>HKG Book Store was founded out of a passion for books and a desire to make reading more accessible to everyone. We believe in the power of stories, the magic of knowledge, and the joy of discovering a new favorite book. What started as a small idea has grown into a thriving online bookstore serving book lovers worldwide.</p>        
                                    
            <h2>Why Choose Us?</h2>
            <ul>
                <li><strong>Wide Selection:</strong> From fiction to non-fiction, academic to self-help, we offer books across all genres.</li>
                <li><strong>Curated Collections:</strong> Handpicked recommendations to suit every reader’s taste.</li>
                <li><strong>Community Driven:</strong> Join us for book discussions, recommendations, and more!</li>
                <li><strong>Convenient Shopping:</strong> A seamless and hassle-free online book-buying experience.</li>
            </ul>
            
            <p>📚 Happy reading!</p>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
