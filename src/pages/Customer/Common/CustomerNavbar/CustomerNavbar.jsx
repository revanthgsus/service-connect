import React, { useContext } from 'react';
import "./CustomerNavbar.css";
import Menubtn from './../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { IoMoonOutline, IoSunny } from "react-icons/io5";
import ThemeContext from '../../../../contexts/ThemeContext';
import CustomLogo from './../../../../common/MainLogo/CustomLogo';
import CustomerDropdown from './../CustomerDropdown/CustomerDropdown';
import { MdMailOutline } from "react-icons/md";
import CustomerNotification from '../CustomerNotfication/CustomerNotification';

const CustomerNavbar = ({ handleDrawerToggle, isOpen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Navbar expand={false} className="customer-navbar fixed-top" >
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
            <Menubtn handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
          </div>
          <div className="navbar-icons">
            <CustomerNotification />
            <IconButton>
              <Badge badgeContent={1} color="error">
                <MdMailOutline className="notification" />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleTheme} aria-label="Toggle Theme" className="theme-toggle-btn">
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>
            <CustomerDropdown />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomerNavbar;
