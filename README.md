# Anime Insight App

Anime Insight is a mobile application that allows users to search for anime, create a watchlist, and track episode progress across seasons. The app is built using React Native with Expo and TypeScript on the frontend, and Node.js with MongoDB on the backend. Firebase Authentication handles user login and registration. Anime data is fetched from the AniList GraphQL API.

## Features

- User authentication with Firebase
- Anime search via AniList GraphQL API
- Add anime to a personalized watchlist
- Track episode progress by season
- Episode progress stored in MongoDB and synced via Express API
- Support for light and dark themes

## Technologies Used

- React Native (Expo)
- TypeScript
- Firebase Authentication
- Node.js + Express.js
- MongoDB (Mongoose)
- AniList GraphQL API

This project was initially set up using `create-expo-app`.


## To run the project locally:

```bash
git clone https://github.com/mare18explore/anime-insight-app.git
cd anime-insight-app
npm install

# Create a .env file in the backend folder with the following:
MONGO_URI=your_mongodb_connection_string
PORT=5055

# Create a .env file in the app/ folder with the following:
BASE_URL=http://localhost:5055

# Start the backend server
cd backend
node server.js

# In a separate terminal window/tab, start the frontend
npx expo start
```
## Author

Created by Abdi Mare  
GitHub: [@mare18explore](https://github.com/mare18explore)
