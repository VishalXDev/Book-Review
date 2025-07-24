import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout, username } = useAuth();

  const handleLogout = () => {
    logout();
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-lg font-semibold">📚 Book Review</Link>
      <div className="space-x-4 flex items-center">
        {token ? (
          <>
            <span className="text-sm text-gray-300">👋 {username}</span>
            <Link to="/add-book" className="hover:underline">Add Book</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
