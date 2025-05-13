import React from 'react';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/comman/sidebar/dashboard.svg";
import { ReactComponent as AppointmentIcon } from "../../../../assets/images/comman/sidebar/appointment.svg";
import { ReactComponent as QuotesIcon } from "../../../../assets/images/comman/sidebar/quotes.svg";
import { ReactComponent as ActivityIcon } from "../../../../assets/images/comman/sidebar/activity.svg";
import { ReactComponent as InvoiceIcon } from "../../../../assets/images/comman/sidebar/invoice.svg";
import { ReactComponent as TransactionIcon } from "../../../../assets/images/comman/sidebar/transaction.svg";
import Sidebar from '../../../../components/Sidebar/Sidebar';

const CustomerSidebar = ({ isOpen, handleCloseSidebar, sidebarRef }) => {

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
      title: 'Transaction',
      icon: <TransactionIcon />,
      link: "customer/transaction"
    },
  ];

  return (
    <>
      <Sidebar
        isOpen={isOpen}
        handleCloseSidebar={handleCloseSidebar}
        sidebarRef={sidebarRef}
        sidebarItems={sidebarItems} />
    </>
  );
};

export default CustomerSidebar;
