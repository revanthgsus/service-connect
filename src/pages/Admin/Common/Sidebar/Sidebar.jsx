import React from 'react';
import "./Sidebar.css";
import { NavLink } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/admin/dashboard.svg";
import { ReactComponent as AdvisorIcon } from "../../../../assets/images/admin/service-advisor.svg";
import { ReactComponent as ManagerIcon } from "../../../../assets/images/admin/service-manager.svg";
import { ReactComponent as CustomerIcon } from "../../../../assets/images/admin/customer.svg";

const Sidebar = ({ isOpen }) => {
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "admin/dashboard"
    },
    {
      title: 'Service Manager',
      icon: <ManagerIcon />,
      link: "admin/service-manager"
    },
    {
      title: 'Service Advisor',
      icon: <AdvisorIcon />,
      link: "admin/service-advisor"
    },
    {
      title: 'Customers',
      icon: <CustomerIcon />,
      link: "admin/customer"
    },
  ];

  return (
    <aside className={`sidebar-section ${isOpen ? "open" : ""}`}>
      {sidebarItems.map((item, index) => (
        <ul key={index} className='sidebar-link'>
          <li>
            <NavLink
              to={`/${item.link}`}
              className={({ isActive }) => (isActive ? "active-link" : "")}
              aria-label={item.title}>
              <span>{item.icon}</span>
              <span className='sidebar-content'>{item.title}</span>
            </NavLink>
          </li>
        </ul>
      ))}
    </aside>
  );
};

export default Sidebar;
