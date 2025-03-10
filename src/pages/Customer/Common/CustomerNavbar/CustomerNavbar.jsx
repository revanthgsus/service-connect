import React, { useContext } from 'react';
import "./CustomerNavbar.css";
import Menubtn from './../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import IconButton from '@mui/material/IconButton';
import { IoMoonOutline, IoSunny } from "react-icons/io5";
import ThemeContext from '../../../../contexts/ThemeContext';
import CustomLogo from './../../../../common/MainLogo/CustomLogo';
import CustomerDropdown from './../CustomerDropdown/CustomerDropdown';
import { Tooltip } from 'react-tooltip';
import NotifyDropdown from '../NotifyDropdown/NotifyDropdown';
import MessageDropdown from './../MessageDropdown/MessageDropdown';

const CustomerNavbar = ({ handleDrawerToggle, isOpen, menuBtnRef }) => {
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
            <Menubtn handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} menuBtnRef={menuBtnRef} />
          </div>

          <div className="navbar-icons">
            <NotifyDropdown />
            <MessageDropdown />

            <IconButton aria-label="Toggle Theme" data-tooltip-id="theme-tooltip" data-tooltip-content="Switch Theme" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>

            <CustomerDropdown />

            <Tooltip id="theme-tooltip" className="custom-tooltip" />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomerNavbar;
