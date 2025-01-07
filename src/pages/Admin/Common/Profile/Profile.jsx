import React from 'react';
import "../../Common/Profile/Profile.css"
import CustomNavbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const Profile = () => {
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

export default Profile