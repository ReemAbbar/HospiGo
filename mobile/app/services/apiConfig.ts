// app/services/apiConfig.ts

import axios from "axios";

// Base URL for API endpoints
// For development with Expo, use your computer's IP address instead of localhost
// Replace with your actual IP address when testing
// const API_URL = "http://192.168.0.3:3000/api";
// const API_URL = "http://10.3.124.201:3000/api";
const API_URL = "http://192.168.100.17:3000/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
