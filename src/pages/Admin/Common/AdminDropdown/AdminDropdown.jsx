import React, { useEffect, useState } from 'react';
import "./AdminDropdown.css";
import { BsPersonCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { HiOutlineUsers } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import Logout from '../../../../common/Logout/Logout';

const AdminDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, []);

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
      <div className='admin-dropdown'>
        <IconButton onClick={toggleDropdown} className="profile-icon">
          <BsPersonCircle />
        </IconButton>
        {isDropdownOpen && (
          <div className="dropdownfile">
            <ul>
              {role === "Super Admin" && (
                <li>
                  <Link to="/admin/adminlist" onClick={() => setIsDropdownOpen(false)}>
                    <HiOutlineUsers />
                    <span>Admin List</span>
                  </Link>
                </li>
              )}
              {role === "Admin" && (
                <li>
                  <Link to="/admin/profile" onClick={() => setIsDropdownOpen(false)}>
                    <AiOutlineUser />
                    <span>View Profile</span>
                  </Link>
                </li>
              )}
              <hr className="mt-2 mb-1" />
              <li className="logout-link" onClick={setShowModal}>
                <Link to="#">
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

export default AdminDropdown;
