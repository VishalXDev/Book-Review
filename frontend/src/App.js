import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage'
import BookListPage from './pages/BookListPage.jsx'
import AddBookPage from './pages/AddBookPage.jsx'
import BookDetailPage from './pages/BookDetailPage'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx' // create this file/component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookListPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/add-book"
          element={
            <PrivateRoute>
              <AddBookPage />
            </PrivateRoute>
          }
        />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
