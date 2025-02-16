import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './AuthLayout.css';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <h2>{title}</h2>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;