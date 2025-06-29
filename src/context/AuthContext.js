// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Retrieve the logged-in user from localStorage on initial load
    const storedUser = localStorage.getItem('currentUser');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse currentUser from localStorage", e);
      return null;
    }
  });

  // This effect persists the currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);


  const navigate = useNavigate();

  /**
   * Logs a user in by checking their credentials against the user list in localStorage.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {boolean} - True if login is successful, false otherwise.
   */
  const login = (email, password) => {
    // Read the latest users list directly from localStorage on every login attempt.
    // This ensures we have the most up-to-date user data, including newly created patients.
    const storedUsers = localStorage.getItem('users');
    const validUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    const userToLogin = validUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (userToLogin) {
      setCurrentUser(userToLogin);
      // The component calling login will handle navigation.
      return true;
    } else {
      alert('Invalid email or password');
      return false;
    }
  };

  /**
   * Logs the current user out.
   */
  const logout = () => {
    setCurrentUser(null);
    navigate('/login'); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
