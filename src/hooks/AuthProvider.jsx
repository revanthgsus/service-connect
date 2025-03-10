import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (token && role && userId) {
      setUser({ token, role, userId });
    }
  }, []);

  const login = (token, role, userId) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    setUser({ token, role, userId });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('theme');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
