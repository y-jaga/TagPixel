require("dotenv").config();

const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.UNSPLASH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
  },
});

module.exports = axiosInstance;
