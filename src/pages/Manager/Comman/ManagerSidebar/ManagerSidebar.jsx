import React from 'react';
import "./ManagerSidebar.css";
import { NavLink } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/manager/dashboard.svg";
import { ReactComponent as ListIcon } from "../../../../assets/images/manager/list-icon.svg";

const ManagerSidebar = ({ isOpen, handleCloseSidebar }) => {
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "manager/dashboard"
    },
    {
      title: 'Appointments',
      icon: <ListIcon />,
      link: "manager/appointments"
    }
  ];

  return (
    <div className='manager-sidebar sidebar'>
      <aside className={`sidebar-section ${isOpen ? "open" : "closed"}`}>
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

export default ManagerSidebar;
