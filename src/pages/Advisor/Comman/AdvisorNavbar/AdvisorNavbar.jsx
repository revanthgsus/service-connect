import React, { useContext, useState } from 'react';
import "./AdvisorNavbar.css";
import Menubtn from '../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomLogo from '../../../../common/MainLogo/CustomLogo';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import IconButton from '@mui/material/IconButton';
import { IoMoonOutline, IoSunny } from "react-icons/io5";
import ThemeContext from '../../../../contexts/ThemeContext';
import AdvisorDropdown from './../AdvisorDropdown/AdvisorDropdown';
import { Tooltip } from 'react-tooltip';
import AdvisorNotify from '../AdvisorNotify/AdvisorNotify';
import MessageDropdown from '../../../../pages/Customer/Common/MessageDropdown/MessageDropdown';

const AdvisorNavbar = ({ handleDrawerToggle, isOpen, menuBtnRef }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <>
      <Navbar expand={false} className="advisor-navbar fixed-top" >
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
            <AdvisorNotify isOpen={activeDropdown === 'notify'}
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

            <AdvisorDropdown isOpen={activeDropdown === 'dropdown'}
              toggleDropdown={() => handleDropdownToggle('dropdown')} />

            <Tooltip id="messages-tooltip" className="custom-tooltip" />
            <Tooltip id="theme-tooltip" className="custom-tooltip" />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default AdvisorNavbar;
