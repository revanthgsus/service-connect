import React, { useEffect, useState } from 'react';
import "./CustomerDropdown.css";
import { BsPersonCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";

const CustomerDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownList = [
    {
      title: 'View Profile',
      icon: <AiOutlineUser />,
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
    <div className='customer-dropdown'>
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
            <hr className="mt-2 mb-1" />
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

export default CustomerDropdown;
