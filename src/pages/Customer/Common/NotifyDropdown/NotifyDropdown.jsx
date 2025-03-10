import React, { useEffect, useState } from 'react';
import './NotifyDropdown.css';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { IoMdTime } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import { TbFileInvoice } from "react-icons/tb";
import { PiChatTeardropText } from "react-icons/pi";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const NotifyDropdown = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const navigate = useNavigate();

  // notification data
  const notificationsData = [
    {
      id: 1,
      type: 'appointment',
      title: 'New Appointments',
      message: 'New appointments are highlight in the appointment page view and accept',
      time: '5 mins ago',
      icon: <BiCalendarCheck />
    },
    {
      id: 2,
      type: 'quotation',
      title: 'Additional Quotes',
      message: 'New quotes are highlight in the quotes page view and accept',
      time: '6 mins ago',
      icon: <PiChatTeardropText />
    },
    {
      id: 3,
      type: 'request',
      title: 'Request Accepted',
      message: 'Request are accepted in the appoitment page ',
      time: '10 mins ago',
      icon: <CheckCircleOutlineIcon />
    },
    {
      id: 4,
      type: 'invoice',
      title: 'Invoice',
      message: 'New invoice are highlight in the invoice page view and accept',
      time: '2 days ago',
      icon: <TbFileInvoice />
    },

  ]
  const handleNavigate = () => {
    setIsNotifyOpen(false);
    navigate('notifications');
  }

  // close notification code
  const toggleNotification = (e) => {
    e.stopPropagation();
    setIsNotifyOpen((prev) => !prev);
  };

  useEffect(() => {
    const closeNotification = (e) => {
      if (!e.target.closest('.notification-container')) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener('click', closeNotification);
    return () => {
      document.removeEventListener('click', closeNotification);
    };
  }, []);

  return (
    <>
      <div className='customer-notification'>
        <Tooltip id="notification-tooltip" className="custom-tooltip" />
        <IconButton
          aria-label="notification"
          data-tooltip-id="notification-tooltip"
          data-tooltip-content="Notifications"
          onClick={toggleNotification}>
          <Badge badgeContent={7} color="error" onClick={toggleNotification}>
            <IoNotificationsOutline className="notification" />
          </Badge>
        </IconButton>

        {isNotifyOpen && (
          <div className='notification-container'>
            <div className='notify-heading'>
              <h6>Notifications</h6>
              <Link to='notifications' onClick={() => setIsNotifyOpen(false)}>View All</Link>
            </div>
            <hr className='break-line' />

            {/* appointment notification */}
            <div className='notifications-list'>
              {notificationsData.map((notification, index) => (
                <div key={index} className="notification-item" onClick={handleNavigate}>
                  <div className={`notification-icon ${notification.type}`}>{notification.icon}</div>
                  <div className="notification-content">
                    <h6>{notification.title}</h6>
                    <p>{notification.message}</p>
                  </div>
                  <div className="notification-time">
                    <IoMdTime /> {notification.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NotifyDropdown;
