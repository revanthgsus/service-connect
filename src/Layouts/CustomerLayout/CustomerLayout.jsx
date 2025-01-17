import React, { useState } from 'react';
import "../CustomerLayout/CustomerLayout.css"
import CustomNavbar from '../../pages/Admin/Common/Navbar/Navbar';
import Sidebar from '../../pages/Admin/Common/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='dashboard-layout'>
                <CustomNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
                <div className="layout-container">
                    <Sidebar isOpen={isOpen} />
                    <main className='layout-main'>
                        <Outlet />
                    </main>
                </div>
            </section>
        </>
    )
}

export default CustomerLayout;