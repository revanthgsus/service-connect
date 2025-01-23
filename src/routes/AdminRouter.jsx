import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../Layouts/AdminLayout/AdminLayout';
import Dashboard from '../pages/Admin/Modules/Dashboard/DashboardContainer/Dashboard';
import ManagerList from './../pages/Admin/Modules/ServiceManager/ManagerList/ManagerList';
import CreateManager from '../pages/Admin/Modules/ServiceManager/CreateManager/CreateManager';
import EditManager from '../pages/Admin/Modules/ServiceManager/EditManager/EditManager';
import AdvisorList from './../pages/Admin/Modules/ServiceAdvisor/AdvisorList/AdvisorList';
import CreateAdvisor from '../pages/Admin/Modules/ServiceAdvisor/CreateAdvisor/CreateAdvisor';
import EditAdvisor from '../pages/Admin/Modules/ServiceAdvisor/EditAdvisor/EditAdvisor';
import CustomerList from '../pages/Admin/Modules/Customer/CustomerList/CustomerList';
import CreateCustomer from '../pages/Admin/Modules/Customer/CreateCustomer/CreateCustomer';
import EditCustomer from '../pages/Admin/Modules/Customer/EditCustomer/EditCustomer';
import AdminList from '../pages/Admin/Common/AdminList/AdminList';
import CreateAdmin from '../pages/Admin/Common/CreateAdmin/CreateAdmin';
import EditAdmin from './../pages/Admin/Common/EditAdmin/EditAdmin';
import Profile from '../pages/Admin/Common/Profile/Profile';

const AdminRouter = () => {
  return (
    <Routes >
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard">
          <Route index element={<Dashboard />} />
        </Route>

        <Route path='service-manager' >
          <Route index element={<ManagerList />} />
          <Route path='createmanager' element={<CreateManager />} />
          <Route path='editmanager' element={<EditManager />} />
        </Route>

        <Route path='service-advisor' >
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
  )
}

export default AdminRouter;
