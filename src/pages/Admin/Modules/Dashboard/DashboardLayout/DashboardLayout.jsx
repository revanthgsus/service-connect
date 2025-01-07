import React from 'react';
import "../DashboardLayout/DashboardLayout.css";
import Kpi from '../Kpi/Kpi';
import Sidebar from '../../../Common/Sidebar/Sidebar';
import CustomNavbar from '../../../Common/Navbar/Navbar';

const DashboardLayout = ({ handleDrawerToggle, isOpen }) => {
  return (
    <>
      <section className='main-page'>
        <CustomNavbar />
        <div className="main-alignment">
          <Sidebar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
          <Kpi />
        </div>
      </section>
    </>
  )
}

export default DashboardLayout;