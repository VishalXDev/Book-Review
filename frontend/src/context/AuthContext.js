import { createContext, useContext, useState, useEffect } from 'react';

// Initialize context with a default value to avoid undefined errors
export const AuthContext = createContext({
  token: '',
  username: '',
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

  // Sync state with localStorage on mount (in case storage changes externally)
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || '';
    const storedUsername = localStorage.getItem('username') || '';
    if (storedToken !== token) setToken(storedToken);
    if (storedUsername !== username) setUsername(storedUsername);
  }, []);

  const login = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
