import React from 'react';
import "../../Common/AddAdmin/AddAdmin.css";
import CustomNavbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const AddAdmin = () => {
  return (
    <>
      <div className='main-page'>
        <CustomNavbar />
        <div className="main-alignment">
          <Sidebar />
        </div>
      </div>
    </>
  )
}

export default AddAdmin;