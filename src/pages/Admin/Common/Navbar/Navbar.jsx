import React, { useState } from 'react';
import "../Navbar/Navbar.css";
import Menubtn from '../../../../common/Menubtn/Menubtn';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomLogo from '../../../../common/MainLogo/CustomLogo';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { ReactComponent as Notification } from "../../../../assets/images/navbar/notification.svg";
import { IoMoonOutline } from "react-icons/io5";
import Dropdown from '../Dropdown/Dropdown';

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <Navbar expand={false} className="custom-navbar">
        <Container fluid className='px-4'>
          <div className='navbar-brand'>
            <Navbar.Brand className='p-0'>
              <CustomLogo />
            </Navbar.Brand>
            <Menubtn handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
          </div>
          <div className='navbar-icons'>
            <IconButton>
              <Badge badgeContent={1} color="error">
                <Notification className='notification' />
              </Badge>
            </IconButton>
            <IconButton>
              <IoMoonOutline className='moon-icon' />
            </IconButton>
            <Dropdown />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomNavbar;
