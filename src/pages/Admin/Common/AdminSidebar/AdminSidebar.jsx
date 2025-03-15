import React from 'react';
import "./AdminSidebar.css";
import { NavLink } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/admin/sidebar/dashboard.svg";
import { ReactComponent as AdminIcon } from "../../../../assets/images/admin/sidebar/admin.svg";
import { ReactComponent as AdvisorIcon } from "../../../../assets/images/admin/sidebar/advisor.svg";
import { ReactComponent as ManagerIcon } from "../../../../assets/images/admin/sidebar/manager.svg";
import { ReactComponent as CustomerIcon } from "../../../../assets/images/admin/sidebar/customer.svg";

const AdminSidebar = ({ isOpen, handleCloseSidebar, sidebarRef }) => {
  const userRole = sessionStorage.getItem('userRole');

  let sidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "admin/dashboard"
    },
    {
      title: 'Admins',
      icon: <AdminIcon />,
      link: "admin/adminlist",
      role: "Super Admin"
    },
    {
      title: 'Service Manager',
      icon: <ManagerIcon />,
      link: "admin/manager"
    },
    {
      title: 'Service Advisor',
      icon: <AdvisorIcon />,
      link: "admin/advisor"
    },
    {
      title: 'Customers',
      icon: <CustomerIcon />,
      link: "admin/customer"
    },
  ];

  sidebarItems = sidebarItems.filter(item =>
    !item.role || item.role.toLowerCase() === userRole?.toLowerCase()
  );

  return (
    <div className='admin-sidebar'>
      <aside className={`sidebar-section ${isOpen ? "open" : "closed"}`} ref={sidebarRef}>
        {sidebarItems.map((item, index) => (
          <ul key={index} className='sidebar-link'>
            <li>
              <NavLink
                to={`/${item.link}`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={handleCloseSidebar}
                aria-label={item.title}>
                <span>{item.icon}</span>
                <span className='sidebar-content'>{item.title}</span>
              </NavLink>
            </li>
          </ul>
        ))}
      </aside>
    </div>
  );
};

export default AdminSidebar;
