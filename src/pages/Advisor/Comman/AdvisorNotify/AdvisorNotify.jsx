import React, { useEffect, useState } from 'react';
import './AdvisorNotify.css';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { IoMdTime } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import { MdPayment } from "react-icons/md";
import { PiChatTeardropText } from "react-icons/pi";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { ReactComponent as NoAppImage } from '../../../../assets/images/comman/no-appointment.svg'

const AdvisorNotify = () => {
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
      type: 'payment',
      title: 'Payment',
      message: 'New payment are highlight in the transaction page view and accept',
      time: '2 days ago',
      icon: <MdPayment />
    },
  ]

  const [notifications, setNotifications] = useState(notificationsData);

  const handleNavigate = (e) => {
    e.stopPropagation();
    setIsNotifyOpen(false);
    navigate('notifications');
  }

  // close notification code
  const toggleNotification = (e) => {
    e.stopPropagation();
    setIsNotifyOpen((prev) => !prev);
  };

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
      <div className='advisor-notification'>
        <Tooltip id="notification-tooltip" className="custom-tooltip" />
        <IconButton
          aria-label="notification"
          data-tooltip-id="notification-tooltip"
          data-tooltip-content="Notifications"
          onClick={toggleNotification}>
          <Badge badgeContent={7} color="error">
            <IoNotificationsOutline className="notification" />
          </Badge>
        </IconButton>

        <div className={`notification-container ${isNotifyOpen ? 'show' : ''}`}>
          <div className='notify-heading'>
            <h6>Notifications</h6>
            <Link to='notifications' onClick={() => setIsNotifyOpen(false)}>View All</Link>
          </div>
          <hr className='break-line' />

          {/* appointment notification */}
          {notifications.length > 0 ? (
            <div className='notifications-list'>
              {notifications.map((notification) => (
                <div id={`notification-${notification.id}`} key={notification.id} className="notification-item" onClick={handleNavigate}>
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

export default AdvisorNotify;
