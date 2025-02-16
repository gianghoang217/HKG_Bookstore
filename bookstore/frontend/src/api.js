import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        console.log("Check access_token", token)
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Full headers:", config.headers);
    }
    return config;
});

export default API;