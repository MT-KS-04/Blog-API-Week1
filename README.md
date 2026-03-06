<h1 align="center">🚀 Blog API - Week 1</h1>

<p align="center">
  <b>A robust and scalable RESTful API for a Blog platform.</b><br>
  Built with <b>TypeScript</b>, <b>Express</b>, and <b>MongoDB (Mongoose)</b>.
</p>

---

## 📖 About The Project

This project is a backend service for a blog application, featuring authentication, role-based access control (Admin & User), article management, and social interactions (comments & likes). It acts as a foundational template, demonstrating the use of robust architectural patterns and modern Node.js/TypeScript practices.

### 🛠️ Tech Stack & Key Libraries

- **Runtime & Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Validation**: express-validator
- **File Uploads**: Multer & Cloudinary
- **Security & Performance**: Helmet, CORS, Express-Rate-Limit, Compression
- **Logging**: Winston & Morgan

---

## 📂 Project Structure

```text
src/
├── @types/       # Custom TypeScript type definitions
├── config/       # App configuration (Environment variables, constants)
├── controller/   # API request handlers
├── lib/          # Third-party library setup (e.g., Mongoose, Winston)
├── middleware/   # Custom Express middlewares (Auth, Validation, Uploads)
├── model/        # Mongoose schemas & models
├── router/       # API route definitions
├── services/     # Core business logic
├── utils/        # Utility functions
└── server.ts     # Main server entry point
```

---

## ⚙️ Installation & Usage

1. **Clone the repository**

   ```bash
   git clone https://github.com/MT-KS-04/Blog-API-Week1.git
   cd Blog-API-Week1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory. Feel free to adjust values according to your configuration.

   ```env
   MONGOOSE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   # Add other required variables (JWT secrets, Cloudinary keys, etc.)
   ```

   > ⚠️ **Note:** Do not commit your `.env` file, as it contains sensitive information.

4. **Run the Project (Development mode with hot-reload)**
   ```bash
   npm start
   ```

---

## 📡 API Reference

Base path for all API endpoints is: `/api/v1`

### 🩺 System

| Method | Endpoint | Description                    | Access |
| :----- | :------- | :----------------------------- | :----- |
| `GET`  | `/`      | API Healthcheck & general info | Public |

### 🔐 Authentication (`/auth`)

| Method | Endpoint              | Description                                     | Access        |
| :----- | :-------------------- | :---------------------------------------------- | :------------ |
| `POST` | `/auth/register`      | Register a new user account                     | Public        |
| `POST` | `/auth/login`         | Log into an existing account                    | Public        |
| `POST` | `/auth/refresh-token` | Obtain a new access token using a refresh token | Public        |
| `POST` | `/auth/logout`        | Log out and invalidate sessions                 | Authenticated |

### 🧑‍💻 Users (`/users`)

| Method   | Endpoint         | Description                          | Access       |
| :------- | :--------------- | :----------------------------------- | :----------- |
| `GET`    | `/users/current` | Retrieve current user profile        | Admin / User |
| `PUT`    | `/users/current` | Update current user profile details  | Admin / User |
| `DELETE` | `/users/current` | Delete current user account          | Admin / User |
| `GET`    | `/users`         | Retrieve a list of all users         | Admin Only   |
| `GET`    | `/users/:userId` | Retrieve a specific user by their ID | Admin Only   |
| `DELETE` | `/users/:userId` | Delete a specific user by their ID   | Admin Only   |

### 📝 Blogs (`/blogs`)

| Method   | Endpoint              | Description                                | Access       |
| :------- | :-------------------- | :----------------------------------------- | :----------- |
| `POST`   | `/blogs`              | Create a new blog post                     | Admin Only   |
| `GET`    | `/blogs`              | Retrieve a list of all blog posts          | Admin Only   |
| `GET`    | `/blogs/user/:userId` | Retrieve all blog posts by a specific user | Admin Only   |
| `GET`    | `/blogs/:slug`        | Retrieve a blog post by its URL slug       | Admin / User |
| `PUT`    | `/blogs/:blogId`      | Update an existing blog post               | Admin Only   |
| `DELETE` | `/blogs/:blogId`      | Delete a blog post                         | Admin Only   |

### 💬 Comments (`/comment`)

| Method   | Endpoint                   | Description                                 | Access       |
| :------- | :------------------------- | :------------------------------------------ | :----------- |
| `POST`   | `/comment/blog/:blogId`    | Add a comment to a specific blog post       | Admin / User |
| `GET`    | `/comment/blog/:blogId`    | Get all comments under a specific blog post | Admin / User |
| `DELETE` | `/comment/blog/:commentId` | Delete a specific comment                   | Admin / User |

### ❤️ Likes (`/likes`)

| Method   | Endpoint              | Description                         | Access       |
| :------- | :-------------------- | :---------------------------------- | :----------- |
| `POST`   | `/likes/blog/:blogId` | Like a specific blog post           | Admin / User |
| `DELETE` | `/likes/blog/:blogId` | Unlike a previously liked blog post | Admin / User |

---

## 📜 License

This project is licensed under the **Apache-2.0 License**. See the `LICENSE` file for more details.
