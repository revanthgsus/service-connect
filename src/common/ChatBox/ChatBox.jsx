import React, { useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import { TbMessageFilled } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const ChatBox = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    const newMessage = { text: message, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is an auto-reply from the advisor.", sender: "advisor" },
      ]);
    }, 1000);
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className='chat-container'>
        <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoClose className='chat-icon' /> : <TbMessageFilled className='chat-icon' />}
          {!isOpen && <span className='chat-badge'>1</span>}
        </div>

        {isOpen && (
          <div className='chat-box'>
            <div className='chat-header'>
              <span>
                <FaRegUserCircle />
              </span>
              <div className='header-content'>
                <h5>ABC Service Center</h5>
                <span>Service Advisor</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <span key={index} className={`message ${msg.sender === "user" ? "user" : "advisor"}`}>
                  {msg.text}
                </span>
              ))}
              <span ref={chatRef} />
            </div>

            <div className='chat-input'>
              <input type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && sendMessage(input)} />
              <span onClick={() => sendMessage(input)}
                className={`send-icon ${!input.trim() ? 'disabled' : ''}`}>
                <BiSolidSend />
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;
