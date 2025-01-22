import React, { useState } from 'react';
import "../CustomerLayout/CustomerLayout.css"
import Sidebar from '../../pages/Admin/Common/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './../../pages/Customer/Common/Navbar/Navbar';

const CustomerLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='dashboard-layout'>
                <CustomerNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
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