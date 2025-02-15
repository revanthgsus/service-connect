import React from 'react';
import "./AdvisorSidebar.css";
import { NavLink } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/advisor/sidebar/dashboard.svg";
import { ReactComponent as AppointmentIcon } from "../../../../assets/images/advisor/sidebar/appointment.svg";
import { ReactComponent as QuotesIcon } from "../../../../assets/images/advisor/sidebar/quotes.svg";
import { ReactComponent as ActivityIcon } from "../../../../assets/images/advisor/sidebar/activity.svg";
import { ReactComponent as InvoiceIcon } from "../../../../assets/images/advisor/sidebar/invoice.svg";

const AdvisorSidebar = ({ isOpen, handleCloseSidebar }) => {
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "advisor/dashboard"
    },
    {
      title: 'Appointments',
      icon: <AppointmentIcon />,
      link: "advisor/appointments"
    },
    {
      title: 'Quotes',
      icon: <QuotesIcon />,
      link: "advisor/quotes"
    },
    {
      title: 'Service Activity',
      icon: <ActivityIcon />,
      link: "advisor/activity"
    },
    {
      title: 'Invoice',
      icon: <InvoiceIcon />,
      link: "advisor/invoice"
    },
  ];

  return (
    <div className='advisor-sidebar sidebar'>
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

export default AdvisorSidebar;
