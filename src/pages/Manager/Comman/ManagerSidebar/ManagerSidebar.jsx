import React from 'react';
import { ReactComponent as DashboardIcon } from "../../../../assets/images/manager/sidebar/dashboard.svg";
import { ReactComponent as ListIcon } from "../../../../assets/images/manager/sidebar/list-icon.svg";
import { ReactComponent as ReportsIcon } from "../../../../assets/images/manager/sidebar/reports.svg";
import Sidebar from '../../../../components/Sidebar/Sidebar';

const ManagerSidebar = ({ isOpen, handleCloseSidebar, sidebarRef }) => {

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      link: "manager/dashboard"
    },
    {
      title: 'Service List',
      icon: <ListIcon />,
      link: "manager/list"
    },
    {
      title: 'Reports',
      icon: <ReportsIcon />,
      link: "manager/reports"
    }
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

export default ManagerSidebar;
