import React, { useEffect, useState } from 'react';
import "./Dropdown.css";
import { BsPersonCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { IoPersonAddSharp } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";

const Dropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownList = [
    {
      title: 'Add Admin',
      icon: <IoPersonAddSharp />,
      link: "/admin/addadmin"
    },
    {
      title: 'View Profile',
      icon: <FiUser />,
      link: "/admin/profile"
    }
  ];

  const logoutItem = {
    title: 'Logout',
    icon: <TbLogout />,
    link: "/"
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
    <div>
      <IconButton onClick={toggleDropdown} className="profile-icon">
        <BsPersonCircle />
      </IconButton>
      {isDropdownOpen && (
        <div className="dropdownfile">
          <ul>
            {dropdownList.map((item, index) => (
              <li key={index}>
                <Link to={item.link}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
            <hr className="mt-2 mb-0" />
            <li className="logout-link">
              <Link to={logoutItem.link}>
                {logoutItem.icon}
                <span>{logoutItem.title}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
