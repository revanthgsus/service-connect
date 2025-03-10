import React, { useEffect, useState } from 'react';
import './AdvisorNotification.css';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import { IoNotificationsOutline } from 'react-icons/io5';
import { HiOutlineBellAlert } from "react-icons/hi2";
import ProfIcon from '../../../../assets/images/dummy.svg'
import { Tooltip } from 'react-tooltip';

const AdvisorNotification = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = (e) => {
    if (!e.target.closest('.advisor-dropdown')) {
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
      <div className='customer-dropdown'>
        <Tooltip id="notification-tooltip" className="custom-tooltip" />

        <IconButton aria-label="notification"
          data-tooltip-id="notification-tooltip"
          data-tooltip-content="Notifications" onClick={toggleDropdown}>
          <Badge badgeContent={7} color="error" onClick={toggleDropdown}>
            <IoNotificationsOutline className="notification" />
          </Badge>
        </IconButton>
        {isDropdownOpen && (
          <div className="dropdownfile notified">
            <ul>
              <li>
                <Link>
                  <HiOutlineBellAlert />
                  <span>Notifications</span><hr />
                  <div className='alignment' >
                    <img src={ProfIcon} alt="ProfIcon" />
                    <div className='notify'>
                      <p><strong>10 New Appointment requests</strong></p>
                      <p>New appointments are highlight in the appointment page view and accpect</p></div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default AdvisorNotification