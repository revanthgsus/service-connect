import React from 'react';
import './ChatBox.css';
import { TbMessageFilled } from "react-icons/tb";

const ChatBox = () => {
  return (
    <>
      <div className='chat-container'>
        <TbMessageFilled />
        <span className='chat-badge'>1</span>
      </div>
    </>
  )
}

export default ChatBox