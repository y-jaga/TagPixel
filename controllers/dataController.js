const user = require("../models/user");
const tag = require("../models/tag");
const photo = require("../models/photo");

const {
  validateCreateUser,
  validateSavePhotos,
  validateAddTags,
} = require("../validations/index");

//creates a new user in user model
const createNewUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    const errors = await validateCreateUser(username, email);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const newUser = await user.create({
      username,
      email,
    });

    res
      .status(201)
      .json({ message: "User created successfully", users: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create new user." });
  }
};

//save a new photo in model photo
const savePhotos = async (req, res) => {
  try {
    const newPhoto = req.body;
    const { imageUrl, tags } = newPhoto;

    const errors = validateSavePhotos(imageUrl, tags);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    const response = await photo.create(newPhoto);

    res
      .status(201)
      .json({ message: "Photo saved successfully", savedPhoto: response });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to save photo into collections." });
  }
};

//adds tags to a photo by photo id
const addTagByPhotoId = async (req, res) => {
  try {
    const photoId = parseInt(req.params.photoId);
    const newTags = req.body.tags;

    const photoObj = await photo.findOne({
      where: { id: photoId },
    });

    const { tags } = photoObj;

    //validation functions
    const errors = validateAddTags(newTags, tags);

    if (errors.length > 0) {
      return res.status(400).json({ error: errors });
    }

    for (const newTagObj of newTags) {
      tags.push(newTagObj);
    }

    await photo.update({ tags: tags }, { where: { id: photoId } });

    res.status(201).json({ message: "Tags added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to add tag to a photo by photo id." });
  }
};

module.exports = { createNewUser, savePhotos, addTagByPhotoId };
