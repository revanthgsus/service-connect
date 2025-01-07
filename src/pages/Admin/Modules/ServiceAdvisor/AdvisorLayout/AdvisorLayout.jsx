import React from 'react';
import "../AdvisorLayout/AdvisorLayout.css";
import CustomNavbar from '../../../Common/Navbar/Navbar';
import Sidebar from '../../../Common/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';


const AdvisorLayout = () => {
  return (
    <>
      <section className='main-page'>
        <CustomNavbar />
        <div className="main-alignment">
          <Sidebar />
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default AdvisorLayout