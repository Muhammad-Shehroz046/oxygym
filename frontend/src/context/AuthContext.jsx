import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Validate token with server
        try {
          const config = {
            headers: {
              'Authorization': `Bearer ${parsedUser.token}`
            }
          };
          
          const { data } = await axios.get('http://localhost:5000/api/auth/validate', config);
          
          // Update user data with latest from server
          const updatedUser = {
            ...parsedUser,
            ...data
          };
          
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updatedUser) => {
    const newUserData = { ...user, ...updatedUser };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};