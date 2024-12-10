const user = require("../models/user");
const photo = require("../models/photo");
const { Op } = require("sequelize");

const validateCreateUser = async (username, email) => {
  const errors = [];

  const userFound = await user.findOne({
    where: { email },
  });

  //if usernamn is not provided.
  if (!username || username.length === 0) {
    errors.push("Username is not provided.");
  }
  //if email is not provided.
  else if (!email || email.length === 0) {
    errors.push("email is not provided.");
  }
  //if username with provided email already exists.
  else if (userFound !== null) {
    errors.push("User with provided email already exists.");
  }
  //if email is not valid
  else if (!email.includes("@") || !email.includes(".")) {
    errors.push("email is not valid.");
  }

  return errors;
};

const validateAddTags = (newTags, existingTags) => {
  const errors = [];

  if (newTags.length + existingTags.length > 5) {
    errors.push(
      "New tags and existing tags must not exceed the length limit 5"
    );
  }

  for (const newTagsObj of newTags) {
    if (newTagsObj.length === 0) {
      errors.push("Tags must be non-empty strings");
      break;
    }
  }

  return errors;
};

const validateSearchHistory = async (userId) => {
  const errors = [];

  if (!userId || isNaN(userId)) {
    errors.push("Invalid or missing userId.");
  } else {
    const userById = await user.findByPk(userId);

    if (!userById)
      errors.push(
        "The provided userId does not exist. Please enter a valid userId."
      );
  }

  return errors;
};

const validateSavePhotos = (imageUrl, tags) => {
  const errors = [];

  if (!imageUrl.startsWith("https://images.unsplash.com/")) {
    errors.push("Invalid image URL");
  }

  if (tags.length > 5) {
    errors.push("Can't provide more then 5 tags for one photo");
  }

  for (const tag of tags) {
    if (tag.length > 20) {
      errors.push("Any tag exceed 20 characters in length.");
    }
  }

  return errors;
};

//return true if query parameter provided and have some value
const validateQueryParam = (query) => {
  if (query && query.length > 0) return true;
  return false;
};

const validateSearchPhotosByTag = async (searchTag, sortType) => {
  const errors = [];

  if (!searchTag) {
    errors.push("tags is required");
  }

  const photos = await photo.findAll({
    where: {
      tags: { [Op.contains]: [searchTag] },
    },
  });

  let searchTagArray = searchTag.split(",");

  if (searchTagArray.length > 1) {
    errors.push("Only a single tag is allowed");
  } else if (photos.length === 0) {
    errors.push("Provided tag doesn't exists in the database.");
  }

  if (sortType.toUpperCase() !== "ASC" && sortType.toUpperCase() !== "DESC") {
    errors.push("Sort query can either be ASC(ascending) or DESC(descending).");
  }

  return errors;
};

module.exports = {
  validateCreateUser,
  validateAddTags,
  validateSearchHistory,
  validateSavePhotos,
  validateQueryParam,
  validateSearchPhotosByTag,
};
