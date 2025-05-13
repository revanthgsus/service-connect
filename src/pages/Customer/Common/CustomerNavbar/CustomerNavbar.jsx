import React, { useContext, useState } from 'react';
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
import MessageDropdown from './../MessageDropdown/MessageDropdown';
import CustomerNotify from '../CustomerNotify/CustomerNotify';

const CustomerNavbar = ({ handleDrawerToggle, isOpen, menuBtnRef }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <>
      <Navbar expand={false} className="customer-navbar fixed-top" >
        <Container fluid className="px-4">

          <div className="navbar-brand">
            <Navbar.Brand className="p-0">
              <div className="custom-logo">
                <CustomLogo theme={theme} />
              </div>
              <div className="mobile-logo">
                <MobileLogo theme={theme} />
              </div>
            </Navbar.Brand>
            <Menubtn handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} menuBtnRef={menuBtnRef} />
          </div>

          <div className="navbar-icons">
            <CustomerNotify isOpen={activeDropdown === 'notify'}
              toggleNotify={() => handleDropdownToggle('notify')} />
            <MessageDropdown isOpen={activeDropdown === 'message'}
              toggleMessage={() => handleDropdownToggle('message')} />

            <IconButton aria-label="Toggle Theme" data-tooltip-id="theme-tooltip" data-tooltip-content="Switch Theme" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>

            <CustomerDropdown isOpen={activeDropdown === 'dropdown'}
              toggleDropdown={() => handleDropdownToggle('dropdown')} />

            <Tooltip id="theme-tooltip" className="custom-tooltip" />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomerNavbar;
