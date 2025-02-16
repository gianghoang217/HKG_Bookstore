import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './shared/AuthLayout';
import FormInput from './shared/FormInput';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData);
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);  // Save token
        localStorage.setItem('refresh_token', response.data.refresh_token); // Save refresh token (optional)
        navigate('/shopping'); // Redirect to Shopping page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout title="Sign In">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-btn">Sign In</button>
      </form>
      <p className="auth-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </AuthLayout>
  );
};

export default SignIn;