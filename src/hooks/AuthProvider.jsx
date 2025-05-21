import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import TokenModal from './../common/TokenModal/TokenModal';
import { jwtDecode } from "jwt-decode";
import { useLocation } from 'react-router-dom';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      // if (location.pathname !== '/') {
      // navigate('/', { replace: true });
      // }
      return;
    }

    if (isTokenExpired(token)) {
      setShowTokenModal(true);
      return;
    };

    const role = sessionStorage.getItem("userRole");
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");
    const online = sessionStorage.getItem("online");
    const companyName = sessionStorage.getItem('companyName');
    const companyLocation = sessionStorage.getItem('companyLocation');

    setUser({ token, role, userId, userName, online, companyName, companyLocation });
  }, [location]);

  const login = (token, role, userId, userName, online, companyName, companyLocation) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('online', online);
    sessionStorage.setItem('companyName', companyName);
    sessionStorage.setItem('companyLocation', companyLocation);
    setUser({ token, role, userId, userName, online, companyName, companyLocation });
    setShowTokenModal(false);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setShowTokenModal(false);
  };

  // check token expiration
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setShowTokenModal }}>
      {children}
      {showTokenModal && <TokenModal showTokenModal={showTokenModal} />}
    </AuthContext.Provider>
  );
};
