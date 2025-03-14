import React, { useContext } from 'react';
import "./AdminNavbar.css";
import Menubtn from '../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomLogo from '../../../../common/MainLogo/CustomLogo';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { IoNotificationsOutline, IoMoonOutline, IoSunny } from "react-icons/io5";
import ThemeContext from '../../../../contexts/ThemeContext';
import AdminDropdown from './../AdminDropdown/AdminDropdown';
import { Tooltip } from 'react-tooltip';

const AdminNavbar = ({ handleDrawerToggle, isOpen, menuBtnRef }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Navbar expand={false} className="admin-navbar fixed-top" >
        <Container fluid className="px-4">

          <div className="navbar-brand">
            <Navbar.Brand className="p-0">
              <div className="custom-logo">
                <CustomLogo />
              </div>
              <div className="mobile-logo">
                <MobileLogo />
              </div>
            </Navbar.Brand>
            <Menubtn handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} menuBtnRef={menuBtnRef} />
          </div>

          <div className="navbar-icons">
            <IconButton aria-label="Notifications" data-tooltip-id="notification-tooltip" data-tooltip-content="Notifications" >
              <Badge badgeContent={0} color="error">
                <IoNotificationsOutline className="notification" />
              </Badge>
            </IconButton>

            <IconButton aria-label="Toggle Theme" data-tooltip-id="theme-tooltip" data-tooltip-content="Switch Theme" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>

            <AdminDropdown />

            <Tooltip id="theme-tooltip" className="custom-tooltip" />
            <Tooltip id="notification-tooltip" className="custom-tooltip" />
          </div>
        </Container >
      </Navbar >
    </>
  );
};

export default AdminNavbar;
