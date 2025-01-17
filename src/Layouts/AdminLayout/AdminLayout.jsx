import React, { useState } from 'react';
import "../AdminLayout/AdminLayout.css";
import CustomNavbar from '../../pages/Admin/Common/Navbar/Navbar';
import Sidebar from '../../pages/Admin/Common/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='admin-layout'>
                <CustomNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
                <div className="layout-container">
                    <Sidebar isOpen={isOpen} />
                    <main className='layout-main'>
                        <Outlet />
                    </main>
                </div>
            </section>
        </>
    );
};

export default AdminLayout;
