import React, { useState } from 'react';
import "../AdvisorLayout/AdvisorLayout.css";
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../pages/Admin/Common/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../pages/Admin/Common/AdminNavbar/AdminNavbar';

const AdvisorLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='dashboard-layout'>
                <AdminNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
                <div className="layout-container">
                    <AdminSidebar />
                    <main className='layout-main'>
                        <Outlet />
                    </main>
                </div>
            </section>
        </>
    );
};

export default AdvisorLayout;
