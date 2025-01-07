import React from 'react'
import CustomNavbar from '../../../Common/Navbar/Navbar'
import Sidebar from '../../../Common/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const CustomerLayout = () => {
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

export default CustomerLayout