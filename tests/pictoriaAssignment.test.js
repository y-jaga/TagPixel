const request = require("supertest");
const app = require("../index");
const user = require("../models/user");
const photo = require("../models/photo");
const searchHistory = require("../models/searchHistory");

const axiosInstance = require("../lib/axios.lib");
const { searchImages } = require("../controllers/imageController");
const {
  validateCreateUser,
  validateQueryParam,
  validateSavePhotos,
  validateAddTags,
  validateSearchPhotosByTag,
  validateSearchHistory,
} = require("../validations/index");
const { Op } = require("sequelize");

let server;

beforeAll(() => {
  server = app.listen(0, () => {
    console.log("Test server running on port 0");
  });
});

afterAll((done) => {
  server.close(done);
});

jest.mock("../models/user");
jest.mock("../models/photo");
jest.mock("../models/searchHistory");
jest.mock("../validations/index");
jest.mock("../lib/axios.lib");

describe("Picotria controllers tests", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("POST /api/users, should create a new user and return status code 201", async () => {
    // Mock the validation function to return no errors
    validateCreateUser.mockResolvedValue([]);

    // Mock the user creation
    const mockUser = {
      id: 1,
      username: "newUser",
      email: "newuser@example.com",
    };

    user.create.mockResolvedValue(mockUser);

    const response = await request(app).post("/api/users").send({
      username: "newUser",
      email: "newuser@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.users).toEqual(mockUser);
    expect(user.create).toHaveBeenCalledWith({
      username: "newUser",
      email: "newuser@example.com",
    });
  });

  it("GET /api/search/photos, should fetch images from the Unsplash API", async () => {
    validateQueryParam.mockResolvedValue(true);

    const mockResponse = {
      data: {
        results: [
          {
            urls: { small: "https://images.unsplash.com/photo-..." },
            description: "A beautiful landscape",
            alt_description: "Mountain view",
          },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const req = { query: { query: "nature" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await searchImages(req, res);

    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/search/photos?query=nature`
    );
    expect(res.json).toHaveBeenCalledWith({
      photos: [
        {
          imageUrl: "https://images.unsplash.com/photo-...",
          description: "A beautiful landscape",
          altDescription: "Mountain view",
        },
      ],
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("POST /api/photos , should save new photo in collections", async () => {
    validateSavePhotos.mockResolvedValue([]);

    const mockResponse = {
      id: 1,
      imageUrl: "<https://images.unsplash.com/photo->...",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: ["nature", "mountain"],
      userId: 1,
    };

    photo.create.mockResolvedValue(mockResponse);

    const response = await request(app)
      .post("/api/photos")
      .send({
        imageUrl: "<https://images.unsplash.com/photo->...",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Photo saved successfully");
    expect(response.body.savedPhoto).toEqual(mockResponse);
    expect(photo.create).toHaveBeenCalledWith({
      imageUrl: "<https://images.unsplash.com/photo->...",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: ["nature", "mountain"],
      userId: 1,
    });
  });

  it("POST /api/photos/:photoId/tags, should add tags to a specific photo by photoId", async () => {
    validateAddTags.mockResolvedValue([]);

    const mockResponse = {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-2",
      description: "City skyline",
      altDescription: "Skyscraper view",
      tags: ["city", "skyline", "mountain"],
    };

    const newTags = ["newTag1", "newTag2"];
    const updatedTags = [...mockResponse.tags, ...newTags];

    await photo.findOne.mockResolvedValue(mockResponse);

    await photo.update.mockResolvedValue([1]);

    const response = await request(app).post("/api/photos/3/tags").send({
      tags: newTags,
    });

    expect(response.status).toBe(201);

    expect(photo.findOne).toHaveBeenCalledWith({ where: { id: 3 } });

    expect(photo.update).toHaveBeenCalledWith(
      { tags: updatedTags },
      { where: { id: 3 } }
    );

    expect(response.body.message).toBe("Tags added successfully");
  });

  it("POST /api/photos/tag/search, should search photos by tags and create an entry in searchHistory model", async () => {
    validateSearchPhotosByTag.mockResolvedValue([]);

    const mockTag = "mountain";
    const mockSort = "ASC";
    const mockUserId = 1;

    const mockPhotoResponse = {
      photos: [
        {
          id: 1,
          imageUrl: "https://images.unsplash.com/photo-",
          description: "Beautiful landscape",
          altDescription: "Mountain view",
          tags: ["nature", "mountain", "newTag1", "newTag2"],
          dateSaved: "2024-12-06T11:44:14.692Z",
          userId: 1,
        },
      ],
    };

    const mockSearchHistoryResponse = {
      id: 1,
      query: mockTag,
      userId: mockUserId,
    };

    photo.findAll.mockResolvedValue(mockPhotoResponse);

    searchHistory.create.mockResolvedValue(mockSearchHistoryResponse);

    const response = await request(app).post(
      `/api/photos/tag/search?tags=${mockTag}&sort=${mockSort}&userId=${mockUserId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.photos).toEqual(mockPhotoResponse);
    expect(searchHistory.create).toHaveBeenCalledWith({
      query: mockTag,
      userId: mockUserId,
    });
    expect(photo.findAll).toHaveBeenCalledWith({
      where: {
        tags: { [Op.contains]: [mockTag] },
      },

      order: [["dateSaved", "ASC"]],
    });
  });

  it("GET /api/search-history, should get search history by user id", async () => {
    validateSearchHistory.mockResolvedValue([]);

    const mockResponse = [
      {
        id: 2,
        query: "mountain",
        userId: 1,
      },
    ];

    searchHistory.findAll.mockResolvedValue(mockResponse);

    const response = await request(app)
      .get("/api/search-history")
      .query({ userId: 1 });

    expect(response.status).toBe(200);

    expect(response.body.searchHistories).toEqual(mockResponse);

    expect(searchHistory.findAll).toHaveBeenCalledWith({
      where: {
        userId: 1,
      },
    });
  });
});
