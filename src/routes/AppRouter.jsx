import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthRouter from './AuthRouter';
import AdminRouter from './AdminRouter';
import CustomerRouter from './CustomerRouter';
import AdvisorRouter from './AdvisorRouter';
import ManagerRouter from './ManagerRouter';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/customer/*" element={<CustomerRouter />} />
      <Route path="/advisor/*" element={<AdvisorRouter />} />
      <Route path="/manager/*" element={<ManagerRouter />} />
    </Routes>
  );
}

export default AppRouter;
