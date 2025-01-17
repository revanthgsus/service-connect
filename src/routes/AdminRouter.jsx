import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddAdmin from '../pages/Admin/Common/AddAdmin/AddAdmin';
import Profile from '../pages/Admin/Common/Profile/Profile';
import CreateManager from '../pages/Admin/Modules/ServiceManager/CreateManager/CreateManager';
import ManagerList from './../pages/Admin/Modules/ServiceManager/ManagerList/ManagerList';
import CreateAdvisor from '../pages/Admin/Modules/ServiceAdvisor/CreateAdvisor/CreateAdvisor';
import AdvisorList from './../pages/Admin/Modules/ServiceAdvisor/AdvisorList/AdvisorList';
import CustomerList from '../pages/Admin/Modules/Customer/CustomerList/CustomerList';
import CreateCustomer from '../pages/Admin/Modules/Customer/CreateCustomer/CreateCustomer';
import AdminLayout from '../Layouts/AdminLayout/AdminLayout';
import Kpi from '../pages/Admin/Modules/Dashboard/Kpi/Kpi';
import EditManager from '../pages/Admin/Modules/ServiceManager/EditManager/EditManager';
import EditAdvisor from '../pages/Admin/Modules/ServiceAdvisor/EditAdvisor/EditAdvisor';
import EditCustomer from '../pages/Admin/Modules/Customer/EditCustomer/EditCustomer';

const AdminRouter = () => {
  return (
    <Routes >
      <Route path="/" element={<AdminLayout/>}>
        <Route path="dashboard">
          <Route index element={<Kpi/>}/>
        </Route>

        <Route path='service-manager' >
          <Route index element={<ManagerList />} />
          <Route path='createmanager' element={<CreateManager />} />
          <Route path='editmanager' element={<EditManager />} />
        </Route>

        <Route path='service-advisor' >
          <Route index element={<AdvisorList />} />
          <Route path='createadvisor' element={<CreateAdvisor />} />
          <Route path='editadvisor' element={<EditAdvisor/>}/>
        </Route>

        <Route path='customer' >
          <Route index element={<CustomerList />} />
          <Route path='createcustomer' element={<CreateCustomer />} />
          <Route path='editcustomer' element={<EditCustomer />} />
        </Route>

        {/* <Route path="addadmin" element={<AddAdmin />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
      </Route>
    </Routes>
  )
}

export default AdminRouter;
