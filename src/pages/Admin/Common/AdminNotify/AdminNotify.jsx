import React, { useEffect, useRef, useState } from 'react';
import './AdminNotify.css';
import IconButton from '@mui/material/IconButton';
import { Badge } from '@mui/material';
import { IoMdTime } from "react-icons/io";
import { IoNotificationsOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import { MdPayment } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { ReactComponent as NoAppImage } from '../../../../assets/images/comman/no-notification.svg'

const AdminNotify = ({ isOpen, toggleNotify }) => {
  const notifyRef = useRef(null);

  // notification data
  const notificationsData = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment',
      message: 'New payment are highlight in the transaction page view and accept',
      time: '5 days ago',
      icon: <MdPayment />
    },
  ]

  const [notifications, setNotifications] = useState(notificationsData);

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    // Add exit class for smooth removal
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.classList.add('fade-out');
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      }, 300);
    }
  };

  // click outside to close notification
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        toggleNotify(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleNotify])

  return (
    <>
      <div className='admin-notification' ref={notifyRef}>
        <Tooltip id="notification-tooltip" className="custom-tooltip" />
        <IconButton
          aria-label="notification"
          data-tooltip-id="notification-tooltip"
          data-tooltip-content="Notifications"
          onClick={toggleNotify} id="dropdown-basic-button" title="Dropdown button">
          <Badge badgeContent={notifications.length} color="error">
            <IoNotificationsOutline className="notification" />
          </Badge>
        </IconButton>

        <div className={`notification-container ${isOpen ? 'show' : ''}`}>
          <div className='notify-heading'>
            <h6>Notifications</h6>
            {/* <Link to='notifications' onClick={() => setIsNotifyOpen(false)}>View All</Link> */}
          </div>
          <hr className='break-line' />

          {/* appointment notification */}
          {notifications.length > 0 ? (
            <div className='notifications-list'>
              {notifications.map((notification) => (
                <div id={`notification-${notification.id}`} key={notification.id} className="notification-item">
                  <div className={`notification-icon ${notification.type}`}>{notification.icon}</div>
                  <div className="notification-content">
                    <h6>{notification.title}</h6>
                    <p>{notification.message}</p>
                  </div>
                  <div className="notification-time">
                    <span> <IoMdTime /> {notification.time}</span>

                    <span className='mark-icon'
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      data-tooltip-id={`mark-read-tooltip-${notification.id}`}
                      data-tooltip-content="Mark as read"
                      aria-label="Mark as read">
                      <IoCheckmarkDoneOutline />
                    </span>
                    <Tooltip id={`mark-read-tooltip-${notification.id}`} className="custom-tooltip" />

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='no-appointment'>
              <NoAppImage />
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminNotify;
