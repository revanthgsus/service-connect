import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthRouter from './AuthRouter';
import PreLoader from '../common/PreLoader/PreLoader';

const AdminRouter = React.lazy(() => import('./AdminRouter'));
const CustomerRouter = React.lazy(() => import('./CustomerRouter'));
const AdvisorRouter = React.lazy(() => import('./AdvisorRouter'));
const ManagerRouter = React.lazy(() => import('./ManagerRouter'));

const AppRouter = () => {
  return (
    <Suspense fallback={<PreLoader />}>
      <Routes>
        <Route path="/*" element={<AuthRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/customer/*" element={<CustomerRouter />} />
        <Route path="/advisor/*" element={<AdvisorRouter />} />
        <Route path="/manager/*" element={<ManagerRouter />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
