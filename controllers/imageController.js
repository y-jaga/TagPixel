const axiosInstance = require("../lib/axios.lib");
const { Op } = require("sequelize");
const photo = require("../models/photo");
const searchHistory = require("../models/searchHistory");
const {
  validateQueryParam,
  validateSearchPhotosByTag,
  validateSearchHistory,
} = require("../validations/index");

//It makes an API call to unsplash using axios to get images based on query param.
const searchImages = async (req, res) => {
  try {
    const { query } = req.query;

    if (!validateQueryParam(query)) {
      return res
        .status(400)
        .json({ error: "query parameter is not provided." });
    }

    const response = await axiosInstance.get(`/search/photos?query=${query}`);

    //urls, description, alt_description
    const { results } = response.data;

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for the given query." });
    }

    const photos = [];

    for (const img of results) {
      const { urls, description, alt_description } = img;
      photos.push({
        imageUrl: urls.small,
        description: description,
        altDescription: alt_description,
      });
    }

    res.status(200).json({ photos });
  } catch (error) {
    //The Unsplash API will send a 401 Unauthorized status if the API key is missing or invalid,
    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        error:
          "Unsplash API key is missing or invalid, please configure the .env file with a valid UNSPLASH_API_KEY.",
      });
    }
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

//It retrieves all photos based on tags and create an entry in search history
const searchPhotosByTags = async (req, res) => {
  try {
    const { tags: searchTag, sort: sortType = "ASC", userId } = req.query;

    //validations
    const errors = await validateSearchPhotosByTag(searchTag, sortType);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    //find all photos which consist of searchTag in their tags.
    const photos = await photo.findAll({
      where: {
        tags: { [Op.contains]: [searchTag] },
      },

      order: [["dateSaved", sortType.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
    });

    // create an entry in searchHistory model with searchTag and userId when the search is made.
    if (userId) {
      try {
        const response = await searchHistory.create({
          query: searchTag,
          userId: parseInt(userId),
        });
        console.log("New search history created in searchHistory model.");
        console.log(response);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to create a search history." });
      }
    }

    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch photo by tags." });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    const errors = await validateSearchHistory(userId);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const searchHistories = await searchHistory.findAll({
      where: {
        userId,
      },
    });

    return res.status(200).json({ searchHistories });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch search history by userId." });
  }
};
module.exports = { searchImages, searchPhotosByTags, getSearchHistory };
