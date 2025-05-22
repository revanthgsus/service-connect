import React, { useCallback, useEffect, useRef, useState } from 'react';
import './NotificationDropdown.css';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
// notification icon import
import { IoMdTime } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import { PiChatTeardropText } from "react-icons/pi";
import { TbFileInvoice } from "react-icons/tb";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ReactComponent as EscalateIcon } from "../../assets/images/manager/escalate.svg";

import { ReactComponent as NoAppImage } from '../../assets/images/comman/no-notification.svg';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const NotificationDropdown = ({ isOpen, toggleNotify }) => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const notifyRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const userId = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole");
  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");


  // icon mapping for notification types
  const getIconByType = (type) => {
    switch (type) {
      case 'Appointment': return <BiCalendarCheck />;
      case 'Quotation': return <PiChatTeardropText />;
      case 'Activity': return <CheckCircleOutlineIcon />;
      case 'Invoice': return <TbFileInvoice />;
      case 'Payment': return <MdPayment />;
      case 'Escalate': return <EscalateIcon />;
      default: return <IoNotificationsOutline />;
    }
  };


  // view all notifications api call
  const fetchNotifications = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    let apiurl = '';

    if (userRole === 'Manager') {
      apiurl = `${API_BASE_URL}/managerMaster/viewNotificationsByCompanyNameAndLocation/${companyName}/${companyLocation}`;
    } else {
      apiurl = `${API_BASE_URL}/customerMaster/viewNotificationsByReferenceId/${userId}`;
    }

    setLoading(true);

    try {
      const response = await axios.get(apiurl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      console.log(response);

      if (response?.data?.status === "success") {
        const notificationsData = response.data.data || [];

        if (notificationsData.length === 0) {
          setNotifications([]);
          return;
        }

        const transformed = notificationsData
          .filter(item => !item.viewed)
          .map((item, index) => ({
            id: item.notificationId || index,
            type: item.notificationType,
            title: item.notificationName,
            message: item.notificationContent,
            appointmentId: item.appointmentId,
            time: item.modifiedAt,
            icon: getIconByType(item.notificationType),
            viewed: item.viewed || false,
          }));

        // Reverse to show latest first
        const newNotifications = transformed.reverse();
        setNotifications(newNotifications);
      } else {
        toast.error("Unable to fetch notifications data.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId, setShowTokenModal, userRole, companyName, companyLocation]);


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const handleNavigate = async (appointmentId, type) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    let navigateUrl = '';
    if (type === 'Appointment') {
      navigateUrl = `${API_BASE_URL}/customerMaster/viewAppointmentById/${appointmentId}`;
    } if (type === 'Quotation') {
      navigateUrl = `${API_BASE_URL}/advisorMaster/viewComplaintsByAppointmentId/${appointmentId}`;
    }

    try {
      const response = await axios.get(navigateUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.status === 200 && response?.data?.status === "success") {
        toggleNotify(false);
        if (type === 'Appointment') {
          navigate("appointments/view", { state: { appointmentData: response?.data?.data } });
        }
        if (type === 'Quotation') {
          navigate("quotes/quotesummary", { state: { quotesData: response?.data } });
        }
      } else {
        toast.error("Unable to retrieve appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setLoading(false);
    }
  };

  // mark as read api call
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    // Add exit class for smooth removal
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.classList.add('fade-out');
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      }, 300);
    }

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/customerMaster/updateViewStatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        setSnackbarMessage("Notification marked as read");
        setSnackbarOpen(true);
      } else {
        toast.error("Failed to mark as read");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    }
  };

  const handleSnackbarClose = () => { setSnackbarOpen(false) };

  // click outside to close notification
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        toggleNotify(false);
      }
    };
    if (isOpen) { document.addEventListener('mousedown', handleClickOutside) }
    return () => { document.removeEventListener('mousedown', handleClickOutside) };
  }, [isOpen, toggleNotify]);


  // convert timestamp to time ago format
  const formatTimeAgo = (timestamp) => {
    const [year, month, day, hour, minute, second] = timestamp;

    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const istDate = new Date(utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const diff = now - istDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      if (days === 1) return "Yesterday";
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <>
      <div className='user-notification' ref={notifyRef}>
        <Tooltip id="notification-tooltip" className="custom-tooltip" />
        <IconButton
          aria-label="notification"
          data-tooltip-id="notification-tooltip"
          data-tooltip-content="Notifications"
          onClick={toggleNotify}>
          <Badge badgeContent={notifications.length} color="error">
            <IoNotificationsOutline className="notification" />
          </Badge>
        </IconButton>

        <div className={`notification-container ${isOpen ? 'show' : ''}`}>
          <div className='notify-heading'>
            <h6>Notifications</h6>
            <Link to='notifications' onClick={() => toggleNotify(false)}>View All</Link>
          </div>
          <hr className='break-line' />

          {loading ? (
            <Box className="loading-container">
              <CircularProgress size={24} />
            </Box>
          ) : (
            notifications.length > 0 ? (
              <div className='notifications-list'>
                {notifications.map((data) => (
                  <div id={`notification-${data.id}`} key={data.id}
                    className="notification-item"
                    onClick={() => handleNavigate(data.appointmentId, data.type)}>
                    <div className={`notification-icon ${data.type}`}>
                      {data.icon}
                    </div>
                    <div className="notification-content">
                      <h6>{data.title}</h6>
                      <p>{data.message}</p>
                    </div>

                    <div className="notification-time">
                      <span className='time-container'> <IoMdTime />{formatTimeAgo(data.time)}</span>

                      {userRole !== 'Manager' && (
                        <>
                          <span className='mark-icon'
                            onClick={(e) => handleMarkAsRead(data.id, e)}
                            data-tooltip-id={`mark-read-tooltip-${data.id}`}
                            data-tooltip-content="Mark as read"
                            aria-label="Mark as read">
                            <IoCheckmarkDoneOutline />
                          </span>
                          <Tooltip id={`mark-read-tooltip-${data.id}`} className="custom-tooltip" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='no-appointment'>
                <NoAppImage />
                <p>No notifications found</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* mark as read snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen && snackbarMessage !== ''}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="info" variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default NotificationDropdown;
