📚 Book Review Platform – Backend API

This is the backend server for the Book Review Platform built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**.

🌐 **Live API Base URL**:  
[https://book-review-2m9o.onrender.com](https://book-review-2m9o.onrender.com)

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs for password hashing
- dotenv for environment config
- Helmet, HPP, Express-Mongo-Sanitize (security)

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-review-platform.git
cd backend
2. Create Environment Variables
Add a .env file in the backend/ directory:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
3. Install Dependencies
bash
Copy
Edit
npm install
4. Start Development Server
bash
Copy
Edit
npm run dev
Runs locally at: http://localhost:5000

📁 Folder Structure
csharp
Copy
Edit
backend/
├── controllers/        # Route handlers
├── models/             # Mongoose schemas
├── routes/             # Express routes
├── middleware/         # Auth & error middleware
├── utils/              # JWT utilities
└── server.js           # Main entry point
🔐 Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and get token

📚 Book Routes
Method	Endpoint	Description
GET	/api/books	Get all books (with filters)
POST	/api/books	Add a book (admin only)
GET	/api/books/:id	Get book details by ID

⭐ Review Routes
Method	Endpoint	Description
POST	/api/books/:id/reviews	Add a review to a book (auth)

🧪 Postman Testing
Use /api/auth/login to obtain JWT token.

Set headers for protected routes:

http
Copy
Edit
Authorization: Bearer <your_token>
🚀 Deployment Notes
Deployed on Render

Backend live at:
https://book-review-2m9o.onrender.com

CORS is configured to allow requests from deployed frontend

⚙️ Environment Setup for Production
Ensure these variables are set on Render:

PORT

MONGO_URI

JWT_SECRET

🤖 AI Usage Disclosure
AI tools were used to assist in boilerplate and structure. All business logic was written and reviewed manually.
```
