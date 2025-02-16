import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shopping.css';
import Navbar from './Navbar';
import Footer from './Footer';
import API from '../api';

const Shopping = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('access_token');
  // Search books
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredBooks(books);
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = books.filter(book => {
      if (searchCategory === 'title') {
        return book.title.toLowerCase().includes(searchValue);
      }
      if (searchCategory === 'author') {
        return book.author.toLowerCase().includes(searchValue);
      }
      if (searchCategory === 'description') {
        return book.description.toLowerCase().includes(searchValue);
      }
      // Search in all fields if 'all' is selected
      return book.title.toLowerCase().includes(searchValue) ||
             book.author.toLowerCase().includes(searchValue) ||
             book.description.toLowerCase().includes(searchValue);
    });
    setFilteredBooks(filtered);
  };

  // Add to Cart
  const addToCart = async (book) => {
    if (!isLoggedIn) {
      // Redirect to login page if user is not logged in
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log("Check token in Shopping: ", token)
      // Make API call to add item to cart
      const response = await API.post('/cart/add', {
        id: book.id,
        quantity: 1
      });

      if (response.status === 201) {
        // Update local cart state
        setCart([...cart, book]);        
        alert('Book added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 422) {
        alert('Authentication error. Please try logging in again.');
        // Optionally redirect to login
        navigate('/login');
    } else {
        alert('Failed to add book to cart. Please try again.');
    }
    }
  };


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get('/books');
        setBooks(response.data);
        setFilteredBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);



  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="shopping-page">
      <Navbar />
            {/* Search Section */}
            <div className="search-section">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="search-category"
        >
          <option value="all">All</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="description">Description</option>
        </select>
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing {filteredBooks.length} of {books.length} books
      </div>
      <div className="book-list">
        {
          filteredBooks.length === 0 ? (
            <p>No books found.</p>
        ) : (
        filteredBooks.map((book) => (
          <div className="book-card" key={book.id}>
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
            <p className="book-description">{book.description}</p>
            <p>Price: ${book.price}</p>
            
            {book.image_url && (
              <div className="book-image-container">
                <img src={book.image_url} alt={book.title} />
              </div>
            )}

            <button onClick={() => addToCart(book)} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        ))
      )
        }
      </div>
      <Footer />
    </div>
  );
};

export default Shopping;