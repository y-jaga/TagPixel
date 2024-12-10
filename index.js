const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database.js");

const {
  createNewUser,
  savePhotos,
  addTagByPhotoId,
} = require("./controllers/dataController.js");

const {
  searchImages,
  searchPhotosByTags,
  getSearchHistory,
} = require("./controllers/imageController.js");

const app = express();
app.use(cors());
app.use(express.json());

//To create Users
//API Endpoint: http://localhost:3000/api/users
app.post("/api/users", createNewUser);

//To search for photos from the Unsplash API
//API Endpoint: http://localhost:3000/api/search/photos?query=nature
app.get("/api/search/photos", searchImages);

//To save new photo in collections
//API Endpoint: http://localhost:3000/api/photos
app.post("/api/photos", savePhotos);

//To add tags to a specific photo by photoId
//API Endpoint: http://localhost:3000/api/photos/1/tags
app.post("/api/photos/:photoId/tags", addTagByPhotoId);

//To search Photos by tags and create an entry in searchHistory model
//API Endpoint: http://localhost:3000/api/photos/tag/search?tags=mountain&sort=ASC&userId=1
app.post("/api/photos/tag/search", searchPhotosByTags);

//To get search history by user id
//API Endpoint: http://localhost:3000/api/search-history?userId=1
app.get("/api/search-history", getSearchHistory);

if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => console.log("Database connection established successfully."))
    .catch((error) => console.error("Unable to connect to database", error));
}

module.exports = app;
