import React, { useEffect, useState } from 'react';
import './MessageDropdown.css';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { IoMdTime } from "react-icons/io";
import { MdMailOutline } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";

const MessageDropdown = () => {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const navigate = useNavigate();

  // message data
  const messagesData = [
    {
      id: 1,
      type: 'messages',
      title: 'Tovino Thomas',
      message: 'Hi, I need to discusss about quotation',
      time: '5 mins ago',
      icon: <BsPersonCircle />
    },
    {
      id: 2,
      type: 'messages',
      title: 'GSUS Star Solutions',
      message: 'Thank you for expressing interest in gsus during our recent conversation',
      time: '10 mins ago',
      icon: <BsPersonCircle />
    },
  ]
  const handleNavigate = () => {
    setIsMessagesOpen(false);
    navigate('messages');
  }

  // close message code
  const toggleNotification = (e) => {
    e.stopPropagation();
    setIsMessagesOpen((prev) => !prev);
  };

  useEffect(() => {
    const closeMessages = (e) => {
      if (!e.target.closest('.message-container')) {
        setIsMessagesOpen(false);
      }
    };
    document.addEventListener('click', closeMessages);
    return () => {
      document.removeEventListener('click', closeMessages);
    };
  }, []);

  return (
    <>
      <div className='customer-messages'>
        <Tooltip id="messages-tooltip" className="custom-tooltip" />

        <IconButton
          aria-label="messages"
          data-tooltip-id="messages-tooltip"
          data-tooltip-content="Messages"
          onClick={toggleNotification} >
          <Badge badgeContent={2} color="error" onClick={toggleNotification}>
            <MdMailOutline className="messages" />
          </Badge>
        </IconButton>

        {isMessagesOpen && (
          <div className='messages-container'>
            <div className='messages-heading'>
              <h6>Notifications</h6>
              <Link to='messages' onClick={() => setIsMessagesOpen(false)}>Clear All</Link>
            </div>
            <hr className='break-line' />

            {/* appointment message */}
            <div className='messages-list'>
              {messagesData.map((message, index) => (
                <div key={index} className="messages-item" onClick={handleNavigate}>
                  <div className={`messages-icon ${message.type}`}>{message.icon}</div>
                  <div className="messages-content">
                    <h6>{message.title}</h6>
                    <p>{message.message}</p>
                  </div>
                  <div className="messages-time">
                    <IoMdTime /> {message.time}
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

export default MessageDropdown;
