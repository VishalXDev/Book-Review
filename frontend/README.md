📚 Book Review Platform – Frontend

This is the React frontend for the Book Review Platform, featuring modern UI, user authentication, book browsing, rating & reviewing system, and filtering/sorting.

🌐 **Live Site**:  
[https://book-review-six-self.vercel.app](https://book-review-six-self.vercel.app)

---

## 🛠️ Tech Stack

- React.js (Hooks & Functional Components)
- Axios (for API requests)
- React Router DOM
- React Hot Toast (notifications)
- Tailwind CSS (styling)
- JWT-based auth with localStorage

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-review-platform.git
cd frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure API Base URL
Update the Axios instance (usually in src/lib/axios.js):

js
Copy
Edit
const api = axios.create({
  baseURL: 'https://book-review-2m9o.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
4. Run Development Server
bash
Copy
Edit
npm run dev
App will be available at: http://localhost:3000

🔐 Auth Features
✅ User registration

✅ Login with JWT

✅ Auth-protected routes (Profile, Review)

✅ Persistent login (localStorage)

📚 Book Features
✅ List all books

✅ View individual book details

✅ Submit reviews with rating

✅ Filter by genre

✅ Sort by rating and date

✅ Pagination support

✨ Styling
Fully responsive design

Tailwind CSS used throughout

Dark mode-ready layout

Toast notifications for user feedback

🔧 Environment Variables (Optional)
If needed, you can add .env.local for frontend config:

env
Copy
Edit
VITE_API_URL=https://book-review-2m9o.onrender.com/api
Make sure the app reads it properly if you're using vite.config.js.

🧪 Testing & Validation
All core features manually tested

Frontend integrated with backend on Render

CORS configured to allow communication

⚙️ Deployment
Deployed on Vercel

Live at:
https://book-review-six-self.vercel.app

Connected to backend hosted on Render