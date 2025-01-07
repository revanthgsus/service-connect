import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../pages/Admin/Modules/Dashboard/DashboardLayout/DashboardLayout';
import ManagerLayout from '../pages/Admin/Modules/ServiceManager/ManagerLayout/ManagerLayout';
import AdvisorLayout from '../pages/Admin/Modules/ServiceAdvisor/AdvisorLayout/AdvisorLayout';
import CustomerLayout from '../pages/Admin/Modules/Customer/CustomerLayout/CustomerLayout';
import AddAdmin from '../pages/Admin/Common/AddAdmin/AddAdmin';
import Profile from '../pages/Admin/Common/Profile/Profile';
import CreateManager from '../pages/Admin/Modules/ServiceManager/CreateManager/CreateManager';
import ManagerList from './../pages/Admin/Modules/ServiceManager/ManagerList/ManagerList';
import CreateAdvisor from '../pages/Admin/Modules/ServiceAdvisor/CreateAdvisor/CreateAdvisor';
import AdvisorList from './../pages/Admin/Modules/ServiceAdvisor/AdvisorList/AdvisorList';
import CustomerList from '../pages/Admin/Modules/Customer/CustomerList/CustomerList';
import CreateCustomer from '../pages/Admin/Modules/Customer/CreateCustomer/CreateCustomer';

const AdminRouter = () => {
  return (
    <Routes >
      <Route path="/dashboard" element={<DashboardLayout />} />

      <Route path='/service-manager' element={<ManagerLayout />} >
        <Route index element={<ManagerList />} />
        <Route path='createmanager' element={<CreateManager />} />
      </Route>

      <Route path='/service-advisor' element={<AdvisorLayout />} >
        <Route index element={<AdvisorList />} />
        <Route path='createadvisor' element={<CreateAdvisor />} />
      </Route>

      <Route path='/customer' element={<CustomerLayout />} >
        <Route index element={<CustomerList />} />
        <Route path='createcustomer' element={<CreateCustomer />} />
      </Route>

      <Route path="/addadmin" element={<AddAdmin />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default AdminRouter;
