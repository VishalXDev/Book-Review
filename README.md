📚 Book Review Platform

A full-stack web application that allows users to register, log in, browse books, submit reviews and ratings, and (admin) add new books.

---

## 🧩 Tech Stack

| Layer     | Tech Used                        |
|-----------|----------------------------------|
| Frontend  | React, React Router DOM, Tailwind |
| Backend   | Node.js, Express, MongoDB, Mongoose |
| Auth      | JWT (JSON Web Tokens)            |

---

## 📁 Project Structure

book-review-platform/
│
├── backend/ # Node.js + Express API
├── frontend/ # React application
└── README.md # Root readme (this file)

yaml
Copy
Edit

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/book-review-platform.git
cd book-review-platform
2. Start the Backend
bash
Copy
Edit
cd backend
npm install
npm run dev
Runs on http://localhost:5000

3. Start the Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
Runs on http://localhost:5173

✅ Features
JWT Authentication

Add, view, and review books

Filter & sort reviews

Secure API with protected routes

Admin can add books

🧪 Testing
After frontend + backend are ready, test using:

Postman for backend

Frontend UI for real flow

✨ AI Usage Note
Some parts of the backend and UI code were generated or assisted using AI to speed up development and maintain consistency.

yaml
Copy
Edit

---

## ✅ `backend/README.md` – Backend API Docs

```md
# 🔧 Backend – Book Review API

This folder contains the Express + MongoDB backend for Book Review Platform.

---

## 📦 Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication

---

## 🚀 Getting Started

### 1. Setup Environment Variables

Create a `.env` file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

perl
Copy
Edit

### 2. Install Dependencies

```bash
npm install
3. Start Server
bash
Copy
Edit
npm run dev
Server runs at http://localhost:5000

📁 Folder Structure
pgsql
Copy
Edit
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── server.js
🔐 Auth API
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user and get token

📚 Books API
Method	Endpoint	Description
GET	/api/books	Get all books
POST	/api/books	Add a book (Admin)
GET	/api/books/:id	Get single book

⭐ Reviews API
Method	Endpoint	Description
POST	/api/books/:id/reviews	Add review to book

✅ Testing with Postman
Import the routes

Set Authorization: Bearer <token> for protected routes

✨ AI Usage Note
The backend structure and CRUD operations were assisted using AI prompts for consistency and speed.

yaml
Copy
Edit

---

## ✅ `frontend/README.md` – Frontend (React)

```md
# 🌐 Frontend – Book Review Platform

This is the React frontend for the Book Review Platform.

---

## 🧰 Tech Used

- React
- React Router DOM
- Axios
- Tailwind CSS
- jwt-decode

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
2. Run App
bash
Copy
Edit
npm run dev
App runs on http://localhost:5173

🗂️ Folder Structure
Copy
Edit
frontend/
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── BookListPage.jsx
│   ├── BookDetailPage.jsx
│   └── AddBookPage.jsx
├── components/
│   └── Navbar.jsx
├── utils/
│   └── auth.js
└── App.jsx
🔐 Auth Logic
JWT stored in localStorage

Navbar updates based on auth state

Admin access for Add Book based on email check

📚 Pages
Route	Description
/	Home (list all books)
/register	Register a new user
/login	Login page
/add-book	Admin adds book
/books/:id	View + review book

✨ AI Usage Note
Parts of the UI (e.g. form structure, navbar logic) were built with help from AI to streamline the layout.