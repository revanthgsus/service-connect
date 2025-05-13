import React, { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
import './MainLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PreLoader from '../../common/PreLoader/PreLoader';

const AdminNavbar = lazy(() => import('../../pages/Admin/Common/AdminNavbar/AdminNavbar'));
const AdminSidebar = lazy(() => import('../../pages/Admin/Common/AdminSidebar/AdminSidebar'));

const CustomerNavbar = lazy(() => import('../../pages/Customer/Common/CustomerNavbar/CustomerNavbar'));
const CustomerSidebar = lazy(() => import('../../pages/Customer/Common/CustomerSidebar/CustomerSidebar'));

const AdvisorNavbar = lazy(() => import('../../pages/Advisor/Comman/AdvisorNavbar/AdvisorNavbar'));
const AdvisorSidebar = lazy(() => import('../../pages/Advisor/Comman/AdvisorSidebar/AdvisorSidebar'));

const ManagerNavbar = lazy(() => import('../../pages/Manager/Comman/ManagerNavbar/ManagerNavbar'));
const ManagerSidebar = lazy(() => import('../../pages/Manager/Comman/ManagerSidebar/ManagerSidebar'));

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sidebarRef = useRef(null);
  const menuBtnRef = useRef(null);

  const role = user?.role?.toLowerCase();

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);


  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize) };
  }, []);


  const handleDrawerToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCloseSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Handle clicks outside the sidebar and menu button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);


  // Role based display navbar & sidebar
  const getLayout = (role) => {
    switch (role) {
      case 'super admin':
      case 'chief admin':
      case 'admin':
        return {
          Navbar: AdminNavbar,
          Sidebar: AdminSidebar,
        };
      case 'customer':
        return {
          Navbar: CustomerNavbar,
          Sidebar: CustomerSidebar,
        };
      case 'advisor':
        return {
          Navbar: AdvisorNavbar,
          Sidebar: AdvisorSidebar,
        };
      case 'manager':
        return {
          Navbar: ManagerNavbar,
          Sidebar: ManagerSidebar,
        };
      default:
        return {};
    }
  };

  const { Navbar, Sidebar } = getLayout(role);

  return (
    <section className="main-layout">
      <Suspense fallback={<PreLoader />}>
        {Navbar &&
          <Navbar
            isOpen={isOpen}
            handleDrawerToggle={handleDrawerToggle}
            menuBtnRef={menuBtnRef} />}

        <div className="layout-container d-flex">
          {Sidebar &&
            <Sidebar
              isOpen={isOpen}
              handleCloseSidebar={handleCloseSidebar}
              sidebarRef={sidebarRef}
              role={role} />}
          <main className="layout-main">
            <Outlet />
          </main>
        </div>
      </Suspense>
    </section>
  );
};

export default MainLayout;
