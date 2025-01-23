import React, { useState } from 'react';
import "./CustomerLayout.css"
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './../../pages/Customer/Common/CustomerNavbar/CustomerNavbar';
import CustomerSidebar from './../../pages/Customer/Common/CustomerSidebar/CustomerSidebar';

const CustomerLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='customer-layout'>
                <CustomerNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
                <div className="layout-container">
                    <CustomerSidebar isOpen={isOpen} />
                    <main className='layout-main'>
                        <Outlet />
                    </main>
                </div>
            </section>
        </>
    )
}

export default CustomerLayout;