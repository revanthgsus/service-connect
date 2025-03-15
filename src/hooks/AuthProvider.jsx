import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
// import TokenModal from './../common/TokenModal/TokenModal';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [showTokenModal, setShowTokenModal] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const role = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('userId');

    if (token && role && userId) {
      setUser({ token, role, userId });
    }
  }, []);

  const login = (token, role, userId) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userId', userId);
    setUser({ token, role, userId });
    // setShowTokenModal(false);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  // const handleClose = () => {
  //   setShowTokenModal(false);
  // }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
      {/* <TokenModal showTokenModal={showTokenModal} handleClose={handleClose} /> */}
    </AuthContext.Provider>
  );
};
