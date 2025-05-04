MERN Project - Event Management System

This is a full-stack Event Management application built with the MERN stack. It allows users to manage events, view analytics, and track participants. The app has both a client-side (React) and server-side (Node.js/Express) component.

Prerequisites

Before getting started, ensure you have the following installed on your machine:

- Node.js (with npm)
- MongoDB (or a cloud-based MongoDB service like MongoDB Atlas)
- Git (for cloning the repository)

Getting Started

1. Download the ZIP File

Download the ZIP file for this project, then extract it to a folder on your local machine.

2. Set Up the Backend (Server)

The backend of the application is built with Node.js and Express, and it interacts with a MongoDB database.

- Open a terminal and navigate to the server directory (this contains the Node.js backend):

  cd /path/to/project-folder/server

- Install the required dependencies:

  npm install

- Create a .env file inside the server directory with the following content:

  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  PORT=5000

- Start the backend server:

  npm start

3. Set Up the Frontend (Client)

The frontend is built with React and styled using Bootstrap.

- Open another terminal and navigate to the client directory:

  cd /path/to/project-folder/client

- Install the required dependencies:

  npm install

- Start the frontend application:

  npm start

4. Access the Application

Once both servers are running, open your browser and go to:

  http://localhost:3000

You can now register, log in, and begin managing events and participants.

Project Structure

project-folder/
│
├── client/             # React frontend
│   └── ...
│
├── server/             # Node.js + Express backend
│   └── ...
│
└── README.txt          # This file

---
This project is intended for educational purposes and can be extended for production use.
