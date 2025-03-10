import React, { useContext } from 'react';
import "./AdvisorNavbar.css";
import Menubtn from '../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomLogo from '../../../../common/MainLogo/CustomLogo';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { IoMoonOutline, IoSunny } from "react-icons/io5";
import ThemeContext from '../../../../contexts/ThemeContext';
import AdvisorDropdown from './../AdvisorDropdown/AdvisorDropdown';
import { MdMailOutline } from "react-icons/md";
import AdvisorNotification from '../AdvisorNotification/AdvisorNotification';
import { Tooltip } from 'react-tooltip';

const AdvisorNavbar = ({ handleDrawerToggle, isOpen, menuBtnRef }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Navbar expand={false} className="advisor-navbar fixed-top" >
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
            <AdvisorNotification />

            <IconButton aria-label="messages" data-tooltip-id="messages-tooltip" data-tooltip-content="Messages" >
              <Badge badgeContent={1} color="error">
                <MdMailOutline className="messages" />
              </Badge>
            </IconButton>

            <IconButton aria-label="Toggle Theme" data-tooltip-id="theme-tooltip" data-tooltip-content="Switch Theme" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>

            <AdvisorDropdown />

            <Tooltip id="messages-tooltip" className="custom-tooltip" />
            <Tooltip id="theme-tooltip" className="custom-tooltip" />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default AdvisorNavbar;
