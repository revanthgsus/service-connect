import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';

const CustomerDashboard = lazy(() => import('../pages/Customer/Modules/Dashboard/CustomerDashboard/CustomerDashboard'));
const AppointmentList = lazy(() => import("../pages/Customer/Modules/Appointment/AppointmentList/AppointmentList"));
const RequestAppointment = lazy(() => import("../pages/Customer/Modules/Appointment/RequestAppointment/RequestAppointment"));

const ManagerRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route path="dashboard">
              <Route index element={<CustomerDashboard />} />
            </Route>

            <Route path='appointments' >
              <Route index element={<AppointmentList />} />
              <Route path='request' element={<RequestAppointment />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default ManagerRouter;