import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const AdminDashboard = lazy(() => import('../pages/Admin/Modules/Dashboard/AdminDashboard/AdminDashboard'));
const ManagerList = lazy(() => import('./../pages/Admin/Modules/ServiceManager/ManagerList/ManagerList'));
const CreateManager = lazy(() => import('./../pages/Admin/Modules/ServiceManager/CreateManager/CreateManager'));
const EditManager = lazy(() => import('./../pages/Admin/Modules/ServiceManager/EditManager/EditManager'));

const AdvisorList = lazy(() => import('../pages/Admin/Modules/ServiceAdvisor/AdvisorList/AdvisorList'));
const CreateAdvisor = lazy(() => import('../pages/Admin/Modules/ServiceAdvisor/CreateAdvisor/CreateAdvisor'));
const EditAdvisor = lazy(() => import('../pages/Admin/Modules/ServiceAdvisor/EditAdvisor/EditAdvisor'));

const CustomerList = lazy(() => import('../pages/Admin/Modules/Customer/CustomerList/CustomerList'));
const CreateCustomer = lazy(() => import('../pages/Admin/Modules/Customer/CreateCustomer/CreateCustomer'));
const EditCustomer = lazy(() => import('../pages/Admin/Modules/Customer/EditCustomer/EditCustomer'));
const AdminList = lazy(() => import('../pages/Admin/Common/AdminList/AdminList'));

const CreateAdmin = lazy(() => import('../pages/Admin/Common/CreateAdmin/CreateAdmin'));
const EditAdmin = lazy(() => import('../pages/Admin/Common/EditAdmin/EditAdmin'));
const AdminProfile = lazy(() => import('../pages/Admin/Common/AdminProfile/AdminProfile'));

const AdminRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes >
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Super Admin"]} />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="dashboard" element={<AdminDashboard />}></Route>

              <Route path='manager' >
                <Route index element={<ManagerList />} />
                <Route path='createmanager' element={<CreateManager />} />
                <Route path='editmanager' element={<EditManager />} />
              </Route>

              <Route path='advisor' >
                <Route index element={<AdvisorList />} />
                <Route path='createadvisor' element={<CreateAdvisor />} />
                <Route path='editadvisor' element={<EditAdvisor />} />
              </Route>

              <Route path='customer' >
                <Route index element={<CustomerList />} />
                <Route path='createcustomer' element={<CreateCustomer />} />
                <Route path='editcustomer' element={<EditCustomer />} />
              </Route>

              <Route path='adminlist' >
                <Route index element={<AdminList />} />
                <Route path='createadmin' element={<CreateAdmin />} />
                <Route path='editadmin' element={<EditAdmin />} />
              </Route>

              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Route>
        </Routes >
      </Suspense>
    </>
  )
}

export default AdminRouter;
