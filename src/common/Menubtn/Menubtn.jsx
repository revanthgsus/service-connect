import React from 'react';
import "../../common/Menubtn/Menubtn.css";
import Navbar from "react-bootstrap/Navbar";

const Menubtn = ({ handleDrawerToggle, isOpen, menuBtnRef }) => {
  return (
    <Navbar.Toggle
      aria-controls="navbar-nav"
      onClick={handleDrawerToggle}
      ref={menuBtnRef}
      className='navbar-toggle'>
      <div className={`hamburger-menu ${isOpen ? "open" : "closed"}`}>
        <div className="line-menu first-line"></div>
        <div className="line-menu middle-line"></div>
        <div className="line-menu last-line"></div>
      </div>
    </Navbar.Toggle>
  );
};

export default Menubtn;