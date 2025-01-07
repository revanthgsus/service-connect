import React from 'react';
import "../ManagerLayout/ManagerLayout.css"
import Sidebar from '../../../Common/Sidebar/Sidebar';
import CustomNavbar from '../../../Common/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const ManagerLayout = () => {
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

export default ManagerLayout;