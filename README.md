## TagPixel (Photo Gallery)

# 📌 Overview

A photo curation app where users can:
✅ Search for images using the Unsplash API
✅ Save images to collections
✅ Add tags to organize images
✅ Search images by tags
✅ Track search history

# 🚀 Features

🔍 Image Search – Fetch images from Unsplash API
🏷️ Tagging System – Add & search images by tags
📂 Collections – Organize images into collections
⏳ Search History – Track past searches

# 🛠️ Tech Stack

| Technology             | Purpose        |
| ---------------------- | -------------- |
| Node.js + Express      | Backend API    |
| Sequelize + PostgreSQL | Database & ORM |
| Unsplash API           | Fetch images   |
| Jest                   | Testing        |

# 📦 Creating account on Unsplash

1. Make an account on Unsplash(https://unsplash.com/oauth/applications)
2. You’ll receive an email from Unsplash for verification. Complete this process
3. Create a new application
4. Agree to the terms & conditions of the Unsplash API. Provide a name & description for your application.
5. Once your application is created scroll down to the Keys section to obtain Unsplash API credentials. Make sure you store these values in .env file and do not expose or push them to Github.

# 📦 Installation

1️⃣ Clone the Repository

git clone https://github.com/y-jaga/TagPixel.git
cd TagPixel

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file and add the following:

- You will find supabase details in your supabase project, at top click on "Connect"

# Supabase Database Connection

DB_USER=your_supbase_project_username
DB_NAME=postgres
DB_HOST=your_supbase_project_hostname
DB_PORT=5432
DB_PASSWORD=your_supbase_project_password

# Unsplash API Credentials

UNSPLASH_BASE_URL=https://api.unsplash.com
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

4️⃣ Run the Server

    npm run start

# or

    npm run dev

# 📝 API Endpoints

| Method | Endpoint                         | Description                                                                      |
| ------ | -------------------------------- | -------------------------------------------------------------------------------- |
| POST   | /api/users                       | To create new User                                                               |
| GET    | /api/photos/search?query=nature  | To search for photos from the Unsplash API based on a user-provided search term. |
| POST   | /api/photos                      | To save photos into collections                                                  |
| POST   | /api/photos/1/tags               | To add Tags for Photos                                                           |
| POST   | /api/photos/tag/search           | To search Photos by tags and sorting by date then save in search history model   |
|        | ?tags=mountain&sort=ASC&userId=1 |                                                                                  |
| GET    | /api/search-history?userId=1     | To get search history by user id 1                                               |

# 📡 API Response Examples & Output

1. API Endpoint: http://localhost:3000/api/search/photos?query=nature

   {
   "photos": [
   {
   "imageUrl": "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2ODI0ODF8MHwxfHNlYXJjaHwxfHxuYXR1cmV8ZW58MHx8fHwxNzM5Nzg4NTYzfDA&ixlib=rb-4.0.3&q=80&w=400",
   "description": null,
   "altDescription": "orange flowers"
   }
   ]
   }

2. API Endpoint: http://localhost:3000/api/search-history?userId=1

   {
   "searchHistories": [
   {
   "id": 2,
   "query": "mountain",
   "userId": 1,
   "timestamp": "2024-12-07T14:59:17.779Z",
   "createdAt": "2024-12-07T14:59:17.780Z",
   "updatedAt": "2024-12-07T14:59:17.780Z"
   },
   ]
   }

# 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request
