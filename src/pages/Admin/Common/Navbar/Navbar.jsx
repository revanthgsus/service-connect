import React, { useContext } from 'react';
import "../Navbar/Navbar.css";
import Menubtn from '../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomLogo from '../../../../common/MainLogo/CustomLogo';
import MobileLogo from '../../../../common/MainLogo/MobileLogo';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";
import Dropdown from '../Dropdown/Dropdown';
import ThemeContext from '../../../../contexts/ThemeContext';

const CustomNavbar = ({ handleDrawerToggle, isOpen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Navbar expand={false} className="custom-navbar fixed-top" >
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
                <IoNotificationsOutline className="notification" />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <IoSunny className="sun-icon" />
              ) : (
                <IoMoonOutline className="moon-icon" />
              )}
            </IconButton>
            <Dropdown />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomNavbar;
