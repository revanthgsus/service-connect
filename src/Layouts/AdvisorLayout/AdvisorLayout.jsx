import React, { useEffect, useState, useRef } from 'react';
import "../AdvisorLayout/AdvisorLayout.css";
import CustomNavbar from '../../pages/Admin/Common/Navbar/Navbar';
import Sidebar from '../../pages/Admin/Common/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const AdvisorLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='dashboard-layout'>
                <CustomNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
                <div className="layout-container">
                    <Sidebar />
                    <main className='layout-main'>
                        <Outlet />
                    </main>
                </div>
            </section>
        </>
    );
};

export default AdvisorLayout;
