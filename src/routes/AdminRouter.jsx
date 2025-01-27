import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import AdminLayout from './../Layouts/AdminLayout/AdminLayout';
import Dashboard from './../pages/Admin/Modules/Dashboard/DashboardContainer/Dashboard';

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
const Profile = lazy(() => import('../pages/Admin/Common/Profile/Profile'));

const AdminRouter = () => {
  return (
    <Suspense fallback={<PreLoader />}>
      <Routes >
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />}></Route>

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
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes >
    </Suspense>
  )
}

export default AdminRouter;
