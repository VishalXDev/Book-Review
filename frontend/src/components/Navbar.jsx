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
    <nav className="bg-black border-b border-gray-900 text-white px-8 py-4 flex justify-between items-center backdrop-blur-sm">
      <Link 
        to="/" 
        className="text-xl font-light tracking-wider hover:text-gray-300 transition-colors duration-200 flex items-center space-x-2"
      >
        <div className="w-6 h-6 border border-white rounded-sm flex items-center justify-center text-xs">B</div>
        <span>REVIEWS</span>
      </Link>
      
      <div className="flex items-center space-x-8">
        {token ? (
          <>
            <div className="text-xs uppercase tracking-widest text-gray-400 border-r border-gray-800 pr-6">
              {username}
            </div>
            <Link 
              to="/add-book" 
              className="text-sm font-light tracking-wide hover:text-gray-300 transition-colors duration-200 border border-gray-800 px-4 py-2 hover:border-gray-600"
            >
              ADD
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-sm font-light tracking-wide hover:text-gray-300 transition-colors duration-200 border border-gray-800 px-4 py-2 hover:border-red-900 hover:text-red-400"
            >
              EXIT
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-sm font-light tracking-wide hover:text-gray-300 transition-colors duration-200 border border-gray-800 px-4 py-2 hover:border-gray-600"
            >
              LOGIN
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-light tracking-wide hover:text-gray-300 transition-colors duration-200 bg-white text-black px-4 py-2 hover:bg-gray-200"
            >
              REGISTER
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;