import React from 'react';
import "./CustomerSidebar.css";
import { NavLink } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/customer/sidebar/dashboard.svg";
import { ReactComponent as AppointmentIcon } from "../../../../assets/images/customer/sidebar/appointment.svg";
import { ReactComponent as QuotesIcon } from "../../../../assets/images/customer/sidebar/quotes.svg";
import { ReactComponent as ActivityIcon } from "../../../../assets/images/customer/sidebar/activity.svg";
import { ReactComponent as InvoiceIcon } from "../../../../assets/images/customer/sidebar/invoice.svg";
import { ReactComponent as PaymentsIcon } from "../../../../assets/images/customer/sidebar/payment.svg";


const CustomerSidebar = ({ isOpen, handleCloseSidebar }) => {
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "customer/dashboard"
    },
    {
      title: 'Appointments',
      icon: <AppointmentIcon />,
      link: "customer/appointments"
    },
    {
      title: 'Quotes',
      icon: <QuotesIcon />,
      link: "customer/quotes"
    },
    {
      title: 'Service Activity',
      icon: <ActivityIcon />,
      link: "customer/activity"
    },
    {
      title: 'Invoice',
      icon: <InvoiceIcon />,
      link: "customer/invoice"
    },
    {
      title: 'Payments',
      icon: <PaymentsIcon />,
      link: "customer/payment"
    },
  ];

  return (
    <div className='customer-sidebar sidebar'>
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

export default CustomerSidebar;
