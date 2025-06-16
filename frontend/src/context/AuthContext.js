import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/apiService'; // Import the api service

const AuthContext = createContext();

console.log("Imported api object:", api);
console.log("Type of api.login:", typeof api.login);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 console.log("AuthContext useEffect running");
    const token = localStorage.getItem('token');
    if (token) {
 console.log("AuthContext useEffect: Token found in localStorage");
      // Verificar token y obtener usuario
 api.getUserDetailsFromToken(token) // Use the api service - corrected function name
      .then(userData => {
 console.log("AuthContext useEffect: getUserDetailsFromToken success", userData);
        setUser(userData);
        setLoading(false);
      })
      .catch((error) => {
 console.error("AuthContext useEffect: getUserDetailsFromToken failed", error);
        localStorage.removeItem('token');
        setLoading(false);
 // Optionally re-throw if you want to handle this in the consuming component
 // throw error;
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { token, role } = await api.login(credentials); // Use the api service
      localStorage.setItem('token', token);
      // Assuming api.login can return more user details, or use the mock structure
      // If api.login only returns token and role, you might need another call here
      // For mock, we'll just set a basic structure that matches the mockUserDetails partially
      setUser({ id: 'mock-id-after-login', username: 'mockuser', role: role || 'user' }); // Set a basic user structure
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw the error so it can be caught by the calling component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};