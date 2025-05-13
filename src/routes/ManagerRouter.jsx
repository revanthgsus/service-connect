import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../common/NotFound/NotFound';

const ManagerDashboard = lazy(() => import('../pages/Manager/Modules/Dashboard/ManagerDashboard/ManagerDashboard'));
const Reviews = lazy(() => import('../pages/Advisor/Modules/Reviews/Reviews'));
const RatingsByAdvisor = lazy(() => import('./../pages/Manager/Modules/Dashboard/RatingsByAdvisor/RatingsByAdvisor'));

const EscalateList = lazy(() => import('../pages/Manager/Modules/Dashboard/EscalateList/EscalateList'));
const ViewAppointment = lazy(() => import('../pages/Customer/Modules/Appointment/ViewAppointment/ViewAppointment'));

const ServiceList = lazy(() => import("../pages/Manager/Modules/Services/ServiceList/ServiceList"));
const ActivityStepper = lazy(() => import("../components/ActivityStepper/ActivityStepper"));

const ReportsList = lazy(() => import("../pages/Manager/Modules/Reports/ReportsList"));

const UserProfile = lazy(() => import("../components/UserProfile/UserProfile"));

const ManagerRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route path='/' element={<MainLayout />}>
              <Route path="dashboard">
                <Route index element={<ManagerDashboard />} />
                <Route path='reviews' element={<RatingsByAdvisor />} />
                <Route path='viewratings' element={<Reviews />} />
                <Route path='escalate' element={<EscalateList />} />
                <Route path='viewescalate' element={<ViewAppointment />} />
              </Route>

              <Route path='list' >
                <Route index element={<ServiceList />} />
                <Route path='viewservice' element={<ViewAppointment />} />
                <Route path='viewprogress' element={<ActivityStepper />} />
              </Route>

              <Route path='reports' >
                <Route index element={<ReportsList />} />
              </Route>

              <Route path="profile" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route >
        </Routes>
      </Suspense>
    </>
  )
}

export default ManagerRouter;