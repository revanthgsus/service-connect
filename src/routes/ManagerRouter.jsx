import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const ManagerDashboard = lazy(() => import('../pages/Manager/Modules/Dashboard/ManagerDashboard/ManagerDashboard'));

const ServiceList = lazy(() => import("../pages/Manager/Modules/ServiceList/ServiceList"));
const ManagerProfile = lazy(() => import("../pages//Manager/Comman/ManagerProfile/ManagerProfile"));

const ManagerRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route path='/' element={<MainLayout />}>
              <Route path="dashboard">
                <Route index element={<ManagerDashboard />} />
              </Route>

              <Route path='list' >
                <Route index element={<ServiceList />} />
              </Route>

              <Route path="profile" element={<ManagerProfile />} />
            </Route>
          </Route >
        </Routes>
      </Suspense>
    </>
  )
}

export default ManagerRouter;