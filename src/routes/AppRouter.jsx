import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AuthRouter from './AuthRouter';
import AdminRouter from './AdminRouter';

const AppRouter = () => {
  return (
    <Router >
      <Routes>
        <Route path="/*" element={<AuthRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
