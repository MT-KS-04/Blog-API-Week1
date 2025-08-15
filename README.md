# Blog API - Week 1

A simple **Blog API** built with **TypeScript**, **Express**, and **MongoDB (Mongoose)**.  
This is part of my learning journey to build backend services from scratch.

## 🚀 Features

- Connect to MongoDB Atlas using Mongoose
- Project structure with separation of concerns
- Environment variables managed via `.env`
- Nodemon + ts-node for hot-reload in development

## 📂 Project Structure

src/
├── config/ # App configuration (env variables, constants)
├── controller/ # API request handlers
├── lib/ # Library setup (e.g., Mongoose connection)
├── middleware/ # Express middlewares
├── model/ # Mongoose schemas & models
├── router/ # API routes
├── services/ # Business logic
├── types/ # TypeScript type definitions
└── server.ts # Main server entry point

## ⚙️ Installation

1. Clone the repository  
   git clone https://github.com/MT-KS-04/Blog-API-Week1.git
2. Install dependencies  
   npm install

## 🛠️ Run the project (development)

npm start

## 🌱 Environment Variables

Create a `.env` file in the project root:
MONGOOSE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
PORT=3000

⚠️ Do not commit your `.env` file — it's already in `.gitignore`.

## 📜 License

This project is licensed under the Apache-2.0 License.
