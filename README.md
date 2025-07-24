📚 Book Review Platform – Fullstack App

Welcome to the Book Review Platform – a fullstack web app where users can register, browse books, submit reviews and ratings, with powerful filtering, sorting, and authentication.

---

## 🚀 Live Deployment

- 🔗 Frontend: [https://book-review-six-self.vercel.app](https://book-review-six-self.vercel.app)
- 🔗 Backend: [https://book-review-2m9o.onrender.com](https://book-review-2m9o.onrender.com)

---

## 📦 Tech Stack

| Layer      | Tech Used                            |
| ---------- | ------------------------------------ |
| Frontend   | React, React Router, Axios, Tailwind |
| Backend    | Node.js, Express, MongoDB, Mongoose  |
| Auth       | JWT                                  |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📁 Project Structure

book-review-platform/
├── backend/ # Express API with MongoDB
├── frontend/ # React frontend with routing and auth
└── README.md # Root readme (this file)

yaml
Copy
Edit

---

## 🧪 Loom Walkthrough

🎥 **Demo Video**:  
_Link your Loom video here after recording._  
_Loom link placeholder: `https://www.loom.com/share/your-video-link`_

---

## 🔧 Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/book-review-platform.git
cd book-review-platform
2. Setup Backend
bash
Copy
Edit
cd backend
npm install
Create a .env file:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Start the server:

bash
Copy
Edit
npm run dev
Backend runs at: http://localhost:5000

3. Setup Frontend
bash
Copy
Edit
cd frontend
npm install
Update Axios base URL in src/lib/axios.js (if not using .env):

js
Copy
Edit
baseURL: 'http://localhost:5000/api',
Then run:

bash
Copy
Edit
npm run dev
Frontend runs at: http://localhost:3000

🧠 Architecture & Features
✅ Core Features
User authentication (JWT)

Book listing and detail view

Review and rating system

Filtering by genre

Sorting by rating and date

Pagination

Protected profile route

✨ Bonus Features
Responsive UI

Toast notifications

Sorting toggle

Deployed on Render + Vercel

🧼 Known Limitations
No admin panel (add book via backend)

Basic form validation

No image/file uploads yet

🙌 Acknowledgements
Built by Vishal Dwivedy for a Frontend Internship Assignment

UI/UX and API structure guided by best practices and rapid iteration via ChatGPT

📬 Contact
For questions or improvements:
📧 Email – vishaldwidy@gmail.com
🐙 GitHub – VishXdev
```
