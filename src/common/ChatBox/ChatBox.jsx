import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import { TbMessageFilled } from "react-icons/tb";
import { HiUser } from "react-icons/hi2";
import { BiSolidSend } from "react-icons/bi";
import { LuExpand, LuMinimize2 } from "react-icons/lu";
import { RiCloseLargeLine } from "react-icons/ri";
import { ReactComponent as ChatEmpty } from '../../assets/images/comman/chat-empty.svg';
import API_BASE_URL from '../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import ChatResponse from './ChatResponse';
import CircularProgress from '@mui/material/CircularProgress';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeLoading, setTypeLoading] = useState(false);
  const referenceId = "CUST_00001";
  const serviceId = "SRVC_00001";

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);


  // chat history api call
  const fetchChatHistory = async () => {
    // setLoading(true);
    const token = sessionStorage.getItem('authToken');

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/getChatHistoryByServiceId/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        const chatMessages = response.data.map(item => {
          return {
            message: item.message,
            sender: item.referenceId === referenceId ? 'user' : 'advisor',
            serviceId: item.serviceId
          };
        });
        setMessages(chatMessages);
      } else {
        toast.error(response.data?.error || "Failed to load messages");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error fetching chat history.");
    } finally {
      setLoading(false);
    }
  };

  const handleBotReply = useCallback((userInput) => {
    const token = sessionStorage.getItem("authToken");
    const autoReply = ChatResponse[userInput.trim().toLowerCase()];

    if (!autoReply) return setTypeLoading(false);

    setTypeLoading(true);

    setTimeout(async () => {
      const botMessage = { message: autoReply, sender: "advisor" };
      setMessages((prev) => [...prev, botMessage]);

      // Store chatbot reply in API
      const botPayload = {
        message: autoReply,
        referenceId: "BOT",
        serviceId: serviceId,
      };

      try {
        await axios.post(`${API_BASE_URL}/customerMaster/chatBox`, botPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error saving bot message:", error);
      } finally {
        setTypeLoading(false);
      }
    }, 1500);
  }, []);

  // send message and bot api call
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const token = sessionStorage.getItem("authToken");
    const userMessage = { message: input, sender: "user" };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    // setTypeLoading(true);

    const payload = {
      message: input,
      referenceId: referenceId,
      serviceId: serviceId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/chatBox`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data.status === "success") {
        fetchChatHistory();

        handleBotReply(input);
      } else {
        toast.error(response.data.error || "Failed to send message");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later");
      // setTypeLoading(false);
    }
  }, [input, handleBotReply]);

  useEffect(() => {
    chatRef.current?.scrollIntoView(0, 0);
  }, [messages]);

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <>
      <div className='chat-container'>
        <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          <TbMessageFilled className='chat-icon' />
          {!isOpen && <span className='chat-badge'>1</span>}
        </div>

        <div className={`chat-box ${isOpen ? "open" : ""} ${isExpanded ? "expanded" : ""}`}>
          <div className='chat-header'>
            <span className='profile-icon'>
              <HiUser />
            </span>
            <div className='header-content'>
              <h5>ABC Service Center</h5>
              <span>Service Advisor</span>
            </div>
            <div className='header-action-icons'>
              <span onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <LuMinimize2 /> : <LuExpand />}
              </span>
              <span onClick={handleClose}>
                <RiCloseLargeLine />
              </span>
            </div>
          </div>

          <div className="chat-messages">
            {loading ? (
              <div className='m-auto'>
                <CircularProgress />
              </div>
            ) : messages.length === 0 ? (
              <div className='empty-section'>
                <ChatEmpty />
                <span>Ask about services, pricing, or anything else!</span>
              </div>
            ) : (
              messages.map((msg, index) => (
                <span key={index} className={`message ${msg.sender}`}>
                  {msg.message}
                </span>
              ))
            )}
            {typeLoading && <span className="message advisor">typing...</span>}
            <span ref={chatRef} />
          </div>

          <div className='chat-input'>
            <input type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()} />
            <span onClick={handleSend}
              className={`send-icon ${!input.trim() ? 'disabled' : ''}`}>
              <BiSolidSend />
            </span>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default ChatBox;
