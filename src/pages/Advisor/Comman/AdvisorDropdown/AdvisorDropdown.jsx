import React, { useEffect, useState } from 'react';
import "./AdvisorDropdown.css";
import { BsPersonCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import Logout from '../../../../common/Logout/Logout';

const AdvisorDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);

  const setShowModal = () => {
    setShow(true)
  }
  const handleCloseModal = () => {
    setShow(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e) => {
    if (!e.target.closest('.dropdownfile') && !e.target.closest('.profile-icon')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <>
      <div className='advisor-dropdown'>
        <IconButton onClick={toggleDropdown} className="profile-icon">
          <BsPersonCircle />
        </IconButton>
        {isDropdownOpen && (
          <div className="dropdownfile">
            <ul>
              <li>
                <Link to="/advisor/profile" onClick={() => setIsDropdownOpen(false)}>
                  <AiOutlineUser />
                  <span>View Profile</span>
                </Link>
              </li>
              <hr className="mt-0 mb-2" />
              <li className="logout-link" onClick={setShowModal}>
                <Link to='#'>
                  <TbLogout />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      <Logout show={show} handleClose={handleCloseModal} />
    </>
  );
};

export default AdvisorDropdown;
