import React, { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
import './MainLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PreLoader from '../../common/PreLoader/PreLoader';

const AppNavbar = lazy(() => import('../../components/AppNavbar/AppNavbar'));

const AdminSidebar = lazy(() => import('../../pages/Admin/Modules/AdminSidebar/AdminSidebar'));
const CustomerSidebar = lazy(() => import('../../pages/Customer/Modules/CustomerSidebar/CustomerSidebar'));
const AdvisorSidebar = lazy(() => import('../../pages/Advisor/Modules/AdvisorSidebar/AdvisorSidebar'));
const ManagerSidebar = lazy(() => import('../../pages/Manager/Modules/ManagerSidebar/ManagerSidebar'));

const UserDropdown = lazy(() => import('../../components/UserDropdown/UserDropdown'));
const NotificationDropdown = lazy(() => import('../../components/NotificationDropdown/NotificationDropdown'));
const MessageNotify = lazy(() => import('../../components/MessageNotify/MessageNotify'));


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


  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize) };
  }, []);

  const handleDrawerToggle = () => { setIsOpen((prev) => !prev) };


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


  // Role based display sidebar
  const getLayout = (role) => {
    switch (role) {
      case 'super admin':
      case 'chief admin':
      case 'admin': return { Sidebar: AdminSidebar };
      case 'customer': return { Sidebar: CustomerSidebar };
      case 'advisor': return { Sidebar: AdvisorSidebar };
      case 'manager': return { Sidebar: ManagerSidebar };
      default: return {};
    }
  };

  // Role based display navbar & dropdowns
  const getNavbarLayout = (role) => {
    switch (role) {
      case 'admin':
      case 'super admin':
      case 'chief admin':
        return {
          DropdownComponent: UserDropdown,
          NotifyComponent: NotificationDropdown,
        };
      case 'customer':
        return {
          DropdownComponent: UserDropdown,
          NotifyComponent: NotificationDropdown,
          MessageComponent: MessageNotify,
        };
      case 'advisor':
        return {
          DropdownComponent: UserDropdown,
          NotifyComponent: NotificationDropdown,
          MessageComponent: MessageNotify,
        };
      case 'manager':
        return {
          DropdownComponent: UserDropdown,
          NotifyComponent: NotificationDropdown,
        };
      default: return {};
    }
  };


  const { Sidebar } = getLayout(role);
  const { DropdownComponent, NotifyComponent, MessageComponent } = getNavbarLayout(role);


  return (
    <section className="main-layout">
      <Suspense fallback={<PreLoader />}>
        {AppNavbar &&
          <AppNavbar
            isOpen={isOpen}
            handleDrawerToggle={handleDrawerToggle}
            menuBtnRef={menuBtnRef}
            DropdownComponent={DropdownComponent}
            NotifyComponent={NotifyComponent}
            MessageComponent={MessageComponent} />}

        <div className="layout-container d-flex">
          {Sidebar &&
            <Sidebar
              isOpen={isOpen}
              handleCloseSidebar={handleCloseSidebar}
              sidebarRef={sidebarRef} />}

          <main className="layout-main">
            <Outlet />
          </main>
        </div>
      </Suspense>
    </section>
  );
};

export default MainLayout;
