import React, { useContext } from 'react';
import "./AdvisorNavbar.css";
import Menubtn from '../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomLogo from '../../../../common/MainLogo/CustomLogo';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { IoNotificationsOutline, IoMoonOutline, IoSunny } from "react-icons/io5";
import ThemeContext from '../../../../contexts/ThemeContext';
import AdvisorDropdown from './../AdvisorDropdown/AdvisorDropdown';
import { MdMailOutline } from "react-icons/md";

const AdvisorNavbar = ({ handleDrawerToggle, isOpen }) => {
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
            <Menubtn handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
          </div>
          <div className="navbar-icons">
            <IconButton>
              <Badge badgeContent={1} color="error">
                <MdMailOutline className="notification" />
              </Badge>
            </IconButton>
            <IconButton>
              <Badge badgeContent={4} color="error">
                <IoNotificationsOutline className="notification" />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleTheme} aria-label="Toggle Theme" className="theme-toggle-btn">
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>
            <AdvisorDropdown />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default AdvisorNavbar;
