import React from 'react';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/admin/sidebar/dashboard.svg";
import { ReactComponent as AdminIcon } from "../../../../assets/images/admin/sidebar/admin.svg";
import { ReactComponent as AdvisorIcon } from "../../../../assets/images/admin/sidebar/advisor.svg";
import { ReactComponent as ManagerIcon } from "../../../../assets/images/admin/sidebar/manager.svg";
import { ReactComponent as CustomerIcon } from "../../../../assets/images/admin/sidebar/customer.svg";
import { ReactComponent as ListIcon } from "../../../../assets/images/admin/sidebar/list.svg";
import Sidebar from '../../../../components/Sidebar/Sidebar';

const AdminSidebar = ({ isOpen, handleCloseSidebar, sidebarRef }) => {
  const userRole = sessionStorage.getItem('userRole')?.toLowerCase();

  const adminSidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "admin/dashboard",
    },
    {
      title: 'Admins',
      icon: <AdminIcon />,
      link: "admin/adminlist",
      roles: ['super admin', 'chief admin'],
    },
    {
      title: 'Service Manager',
      icon: <ManagerIcon />,
      link: "admin/manager",
    },
    {
      title: 'Service Advisor',
      icon: <AdvisorIcon />,
      link: "admin/advisor",
    },
    {
      title: 'Customers',
      icon: <CustomerIcon />,
      link: "admin/customer",
    },
    {
      title: 'Item List',
      icon: <ListIcon />,
      link: "admin/items",
      roles: ["chief admin"],
    },
  ];

  const filteredSidebarItems = adminSidebarItems.filter(item => {
    if (item.roles) {
      return item.roles.map(role => role.toLowerCase()).includes(userRole);
    }
    return true;
  });

  return (
    <>
      <Sidebar
        isOpen={isOpen}
        handleCloseSidebar={handleCloseSidebar}
        sidebarRef={sidebarRef}
        sidebarItems={filteredSidebarItems} />
    </>
  );
};

export default AdminSidebar;
