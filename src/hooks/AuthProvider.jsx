import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const role = sessionStorage.getItem('userRole');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token, role) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userRole', role);
    setUser({ token, role });
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    setUser({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
