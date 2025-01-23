import React, { useState } from 'react';
import "./AdminLayout.css";
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../pages/Admin/Common/AdminNavbar/AdminNavbar';
import AdminSidebar from '../../pages/Admin/Common/AdminSidebar/AdminSidebar';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <section className='admin-layout'>
                <AdminNavbar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
                <div className="layout-container">
                    <AdminSidebar isOpen={isOpen} />
                    <main className='layout-main'>
                        <Outlet />
                    </main>
                </div>
            </section>
        </>
    );
};

export default AdminLayout;
