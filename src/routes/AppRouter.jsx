import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthRouter from './AuthRouter';
import AdminRouter from './AdminRouter';

const AppRouter = () => {
  return (
      <Routes>
        <Route path="/*" element={<AuthRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes> 
  );
}

export default AppRouter;
