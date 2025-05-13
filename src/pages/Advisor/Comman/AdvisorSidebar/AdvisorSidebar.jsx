import React from 'react';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/comman/sidebar/dashboard.svg";
import { ReactComponent as AppointmentIcon } from "../../../../assets/images/comman/sidebar/appointment.svg";
import { ReactComponent as QuotesIcon } from "../../../../assets/images/comman/sidebar/quotes.svg";
import { ReactComponent as ActivityIcon } from "../../../../assets/images/comman/sidebar/activity.svg";
import { ReactComponent as InvoiceIcon } from "../../../../assets/images/comman/sidebar/invoice.svg";
import { ReactComponent as TransactionIcon } from "../../../../assets/images/comman/sidebar/transaction.svg";
import Sidebar from '../../../../components/Sidebar/Sidebar';

const AdvisorSidebar = ({ isOpen, handleCloseSidebar, sidebarRef }) => {

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
    {
      title: 'Transaction',
      icon: <TransactionIcon />,
      link: "advisor/transaction"
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

export default AdvisorSidebar;
