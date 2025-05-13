import React, { useCallback, useEffect, useState } from 'react';
import './AllNotification.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IoMdTime } from "react-icons/io";
import { BiCalendarCheck } from "react-icons/bi";
import { TbFileInvoice } from "react-icons/tb";
import { PiChatTeardropText } from "react-icons/pi";
import { MdPayment } from "react-icons/md";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { ReactComponent as NoAppImage } from '../../assets/images/comman/no-notification.svg'
import { useNavigate } from 'react-router-dom';
import PreLoader from '../../common/PreLoader/PreLoader';
import { useAuth } from '../../contexts/AuthContext';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';

const AllNotification = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [value, setValue] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = sessionStorage.getItem("userRole");
  const referenceId = sessionStorage.getItem("userId");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // icon mapping for notification types
  const getIconByType = (type) => {
    switch (type) {
      case 'Appointment':
        return <BiCalendarCheck />;
      case 'Quotation':
        return <PiChatTeardropText />;
      case 'Request':
        return <CheckCircleOutlineIcon />;
      case 'Activity':
        return <CheckCircleOutlineIcon />;
      case 'Invoice':
        return <TbFileInvoice />;
      case 'Payment':
        return <MdPayment />;
      default:
        return <IoNotificationsOutline />;
    }
  };

  const fetchNotifications = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewNotificationsByReferenceId/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === "success") {
        const transformed = response.data.data
          .map((item, index) => ({
            id: item.notificationId || index,
            type: item.notificationType,
            title: item.notificationName,
            message: item.notificationContent,
            time: item.modifiedAt,
            icon: getIconByType(item.notificationType),
            viewed: item.viewed || false,
          }));

        setNotifications(transformed.reverse());

      } else {
        toast.error("Unable to fetch notifications data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  }, [referenceId, setShowTokenModal]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 100000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1)
  };

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

  const redirectPaths = {
    Customer: {
      Appointment: "/customer/appointments",
      Quotation: "/customer/quotes",
      Activity: "/customer/activity",
      Invoice: "/customer/invoice",
    },
    Advisor: {
      Appointment: "/advisor/appointments",
      Quotation: "/advisor/quotes",
      Activity: "/advisor/activity",
      Invoice: "/advisor/invoice",
    }
  };

  const navigateToPage = (notification) => {
    const path = redirectPaths[userRole]?.[notification.type];
    if (path) navigate(path);
    else toast.info("No page available for this notification.");
  };

  // Tabs split by notification type
  const renderNotifications = (type) => {
    const filtered = type === "All" ? notifications : notifications.filter(n => n.type === type);

    if (loading) return <PreLoader />;
    if (filtered.length === 0) {
      return (
        <div className='no-appointment'>
          <NoAppImage />
          <p>No notifications found</p>
        </div>
      );
    }

    return (
      <div className='notifications-list'>
        {filtered.map((data) => (
          <div
            key={data.id}
            className="notification-item"
            onClick={() => navigateToPage(data)}>
            <div className={`notification-icon ${data.type}`}>
              {data.icon}
            </div>
            <div className="notification-content">
              <h6>{data.title}</h6>
              <p>{data.message}</p>
            </div>
            <div className="notification-time">
              <span className='time-container'><IoMdTime />{formatTimeAgo(data.time)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {loading && <PreLoader />}
      {!loading && (
        <section className='notification-section'>
          <div className="header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>All Notifications</h5>
          </div>

          <Box className='tab-container'>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={false}
                className='tab-header'
                TabIndicatorProps={{
                  style: {
                    backgroundColor: '#007d85',
                    borderRadius: '2px',
                  }
                }}>
                <Tab label="All" value="All" className='multiple-tabs' />
                <Tab label="Appointment" value="Appointment" className='multiple-tabs' />
                <Tab label="Quotation" value="Quotation" className='multiple-tabs' />
                <Tab label="Activity" value="Activity" className='multiple-tabs' />
                <Tab label="Invoice" value="Invoice" className='multiple-tabs' />
              </TabList>

              <div className='tab-data'>
                <TabPanel value="All">{renderNotifications("All")}</TabPanel>
                <TabPanel value="Appointment">{renderNotifications("Appointment")}</TabPanel>
                <TabPanel value="Quotation">{renderNotifications("Quotation")}</TabPanel>
                <TabPanel value="Activity">{renderNotifications("Activity")}</TabPanel>
                <TabPanel value="Invoice">{renderNotifications("Invoice")}</TabPanel>
              </div>
            </TabContext>
          </Box>
        </section>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  )
}

export default AllNotification;