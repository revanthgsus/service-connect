import React, { useCallback, useEffect, useRef, useState } from 'react';
import './MessageDropdown.css';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Tooltip } from 'react-tooltip';
import { IoMdTime } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { toast } from 'react-toastify';
import { ReactComponent as NoMessageImage } from '../../../../assets/images/comman/no-message.svg';
import { MdMailOutline } from "react-icons/md";
import { useAuth } from '../../../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../../services/AuthService';

const NotifyDropdown = ({ isOpen, toggleMessage }) => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const messageRef = useRef(null);
  const referenceId = sessionStorage.getItem("userId");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewMessagesByReferenceId/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === "success") {
        const messagesData = response.data.data || [];

        if (messagesData.length === 0) {
          setMessages([]);
          return;
        }

        const transformed = messagesData
          .filter(msg => !msg.viewed)
          .map((msg, index) => ({
            id: msg.messageId || index,
            title: msg.messageName,
            message: msg.messageContent,
            time: msg.modifiedAt,
            viewed: msg.viewed || false,
          }));

        const newmessages = transformed.reverse();
        setMessages(newmessages);
      } else {
        toast.error("Unable to fetch messages data");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  }, [referenceId, setShowTokenModal]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // click outside to close message
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        toggleMessage(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleMessage]);


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

  const handleNavigate = (e) => {
    e.stopPropagation();
    toggleMessage(false);
    navigate('quotes');
  }

  return (
    <>
      <div className='customer-messages' ref={messageRef}>
        <Tooltip id="messages-tooltip" className="custom-tooltip" />
        <IconButton
          aria-label="messages"
          data-tooltip-id="messages-tooltip"
          data-tooltip-content="Messages"
          onClick={toggleMessage}>
          <Badge badgeContent={messages.length} color="error" >
            <MdMailOutline className="messages" />
          </Badge>
        </IconButton>

        <div className={`messages-container ${isOpen ? 'show' : ''}`}>
          <div className='messages-heading'>
            <h6>Messages</h6>
          </div>
          <hr className='break-line' />

          {/* messages message */}

          {loading ? (
            <Box className="loading-container">
              <CircularProgress size={24} />
            </Box>
          ) : (
            messages.length > 0 ? (
              <div className='messages-list'>
                {messages.map((msg) => (
                  <div id={`messages-${msg.id}`} key={msg.id} className="messages-item"
                    onClick={handleNavigate}>
                    <div className='messages-icon'>
                      {<BsPersonCircle />}</div>
                    <div className="messages-content">
                      <h6>{msg.title}</h6>
                      <p>{msg.message}</p>
                    </div>

                    <div className="messages-time">
                      <span className='time-container'>
                        <IoMdTime />{formatTimeAgo(msg.time)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='no-messages'>
                <NoMessageImage />
                <p>No messages found</p>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default NotifyDropdown;
