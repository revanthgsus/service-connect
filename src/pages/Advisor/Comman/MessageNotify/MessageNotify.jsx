import React, { useEffect, useRef } from 'react';
import './MessageNotify.css';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import { Tooltip } from 'react-tooltip';
import { IoMdTime } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { ReactComponent as NoMessageImage } from '../../../../assets/images/comman/no-message.svg';
import { MdMailOutline } from "react-icons/md";

const MessageNotify = ({ isOpen, toggleMessage }) => {
  const navigate = useNavigate();
  const messageRef = useRef(null);

  // messages data
  const messagesData = [
    {
      id: 1,
      type: 'messages',
      title: 'Tovino Thomas',
      message: 'Hi, I need to discusss about quotation',
      time: '5 mins ago',
      icon: <BsPersonCircle />
    },
    // {
    //   id: 2,
    //   type: 'messages',
    //   title: 'GSUS Star Solutions',
    //   message: 'Thank you for expressing interest in gsus during our recent conversation',
    //   time: '10 mins ago',
    //   icon: <BsPersonCircle />
    // },
    // {
    //   id: 3,
    //   type: 'messages',
    //   title: 'GSUS Star Solutions',
    //   message: 'Thank you for expressing interest in gsus during our recent conversation',
    //   time: '10 mins ago',
    //   icon: <BsPersonCircle />
    // },
  ]

  const handleNavigate = (e) => {
    e.stopPropagation();
    toggleMessage(false);
    navigate('quotes');
  }

  // click outside to close notification
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

  
  return (
    <>
      <div className='advisor-messages' ref={messageRef}>
        <Tooltip id="messages-tooltip" className="custom-tooltip" />
        <IconButton
          aria-label="messages"
          data-tooltip-id="messages-tooltip"
          data-tooltip-content="Messages"
          onClick={toggleMessage}>
          <Badge badgeContent={messagesData.length} color="error" >
            <MdMailOutline className="messages" />
          </Badge>
        </IconButton>

        <div className={`messages-container ${isOpen ? 'show' : ''}`}>
          <div className='messages-heading'>
            <h6>Messages</h6>
          </div>
          <hr className='break-line' />

          {/* messages notification */}
          {messagesData.length > 0 ? (
            <div className='messages-list'>
              {messagesData.map((msg) => (
                <div id={`messages-${msg.id}`} key={msg.id} className="messages-item"
                  onClick={handleNavigate}>
                  <div className='messages-icon'>{msg.icon}</div>
                  <div className="messages-content">
                    <h6>{msg.title}</h6>
                    <p>{msg.message}</p>
                  </div>
                  <div className="messages-time">
                    <span><IoMdTime />{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='no-messages'>
              <NoMessageImage />
              <p>No messages found</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MessageNotify;
