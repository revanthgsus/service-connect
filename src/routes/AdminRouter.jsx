import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../common/NotFound/NotFound';

const AdminDashboard = lazy(() => import('../pages/Admin/Modules/Dashboard/AdminDashboard/AdminDashboard'));
const AdminList = lazy(() => import('../pages/Admin/Modules/Admin/AdminList/AdminList'));
const CreateAdmin = lazy(() => import('../pages/Admin/Modules/Admin/CreateAdmin/CreateAdmin'));
const EditAdmin = lazy(() => import('../pages/Admin/Modules/Admin/EditAdmin/EditAdmin'));

const ManagerList = lazy(() => import('./../pages/Admin/Modules/ServiceManager/ManagerList/ManagerList'));
const CreateManager = lazy(() => import('./../pages/Admin/Modules/ServiceManager/CreateManager/CreateManager'));
const EditManager = lazy(() => import('./../pages/Admin/Modules/ServiceManager/EditManager/EditManager'));

const AdvisorList = lazy(() => import('../pages/Admin/Modules/ServiceAdvisor/AdvisorList/AdvisorList'));
const CreateAdvisor = lazy(() => import('../pages/Admin/Modules/ServiceAdvisor/CreateAdvisor/CreateAdvisor'));
const EditAdvisor = lazy(() => import('../pages/Admin/Modules/ServiceAdvisor/EditAdvisor/EditAdvisor'));

const CustomerList = lazy(() => import('../pages/Admin/Modules/Customer/CustomerList/CustomerList'));
const CreateCustomer = lazy(() => import('../pages/Admin/Modules/Customer/CreateCustomer/CreateCustomer'));
const EditCustomer = lazy(() => import('../pages/Admin/Modules/Customer/EditCustomer/EditCustomer'));

const ItemList = lazy(() => import('../pages/Admin/Modules/ItemList/ItemList/ItemList'));
const CreateItem = lazy(() => import('../pages/Admin/Modules/ItemList/CreateItem/CreateItem'));
const EditItem = lazy(() => import('../pages/Admin/Modules/ItemList/EditItem/EditItem'));

const UserProfile = lazy(() => import("../components/UserProfile/UserProfile"));

const AdminRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes >
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Super Admin", "Chief Admin"]} />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="dashboard" element={<AdminDashboard />}></Route>

              <Route path='adminlist' >
                <Route index element={<AdminList />} />
                <Route path='createadmin' element={<CreateAdmin />} />
                <Route path='editadmin' element={<EditAdmin />} />
              </Route>

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

              <Route path='items' >
                <Route index element={<ItemList />} />
                <Route path='createitem' element={<CreateItem />} />
                <Route path='edititem' element={<EditItem />} />
              </Route>

              <Route path="profile" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes >
      </Suspense>
    </>
  )
}

export default AdminRouter;
