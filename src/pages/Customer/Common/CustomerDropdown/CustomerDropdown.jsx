import React, { useEffect, useState } from 'react';
import "./CustomerDropdown.css";
import { BsPersonCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import Logout from '../../../../common/Logout/Logout';

const CustomerDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const setShowModal = () => {
    setShow(true)
  }
  const handleCloseModal = () => {
    setShow(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
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

  const handleView = (e) => {
    e.preventDefault();
    navigate("/customer/profile");
    setIsDropdownOpen(false);
  }

  return (
    <>
      <div className='customer-dropdown'>
        <IconButton onClick={toggleDropdown} className="profile-icon">
          <BsPersonCircle />
        </IconButton>
        {isDropdownOpen && (
          <div className="dropdownfile">
            <ul>
              <li onClick={handleView}>
                <div>
                  <AiOutlineUser />
                  <span>View Profile</span>
                </div>
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

export default CustomerDropdown;
