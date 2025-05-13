import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import { TbMessageFilled } from "react-icons/tb";
import { HiUser } from "react-icons/hi2";
import { BiSolidSend } from "react-icons/bi";
import { LuExpand, LuMinimize2 } from "react-icons/lu";
import { RiCloseLargeLine } from "react-icons/ri";
import { ReactComponent as ChatEmpty } from '../../assets/images/comman/empty-chat.svg';
import API_BASE_URL from '../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ChatBox = () => {
  const location = useLocation();
  const { quotesData } = location.state || {};
  const { setShowTokenModal } = useAuth();

  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [typeLoading, setTypeLoading] = useState(false);
  const chatRef = useRef(null);

  const referenceId = sessionStorage.getItem("userId");
  const online = sessionStorage.getItem("online");
  const userRole = sessionStorage.getItem("userRole");
  const currentUserId = referenceId;
  const serviceId = quotesData?.data?.serviceId;
  const advisorName = quotesData?.data?.advisorName;
  const customerName = quotesData?.data?.customerName;

  // chat history api call
  const fetchChatHistory = useCallback(async () => {
    // setLoading(true);
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!serviceId || !referenceId) {
      toast.error("Service or Reference ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/getChatHistoryByServiceId/${serviceId}/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const chatMessages = response.data.chatMessages.map(item => ({
          message: item.message,
          sender: item.referenceId,
          serviceId: item.serviceId
        }));
        setMessages(chatMessages);
      } else {
        toast.error(response.data?.message || "Failed to fetch messages");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error fetching chat history.");
    } finally {
      setLoading(false);
    }
  }, [serviceId, referenceId, setShowTokenModal]);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, fetchChatHistory]);


  // const fetchMessageCount = useCallback(async () => {
  //   const token = sessionStorage.getItem("authToken");
  //   if (!token) {
  //     setShowTokenModal(true);
  //     return;
  //   }

  //   if (!referenceId) return;

  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/customerMaster/viewMessagesByReferenceId/${referenceId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     if (response.status === 200 && Array.isArray(response.data)) {
  //       setMessageCount(response.data.length);
  //     } else {
  //       setMessageCount(0);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to fetch message count:", error);
  //     setMessageCount(0);
  //   }
  // }, [referenceId, setShowTokenModal]);


  // useEffect(() => {
  //   fetchMessageCount();
  // }, [fetchMessageCount]);


  // send message and bot api call
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    setInput("");
    // setTypeLoading(true);

    const payload = {
      message: input,
      referenceId: referenceId,
      serviceId: serviceId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/chatBox`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 200 && response.data.status === "success") {
        fetchChatHistory();
      } else {
        toast.error(response.data.error || "Failed to send message");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later");
      // setTypeLoading(false);
    }
  }, [input, setShowTokenModal, referenceId, serviceId, fetchChatHistory]);

  useEffect(() => {
    chatRef.current?.scrollIntoView(0, 0);
  }, [messages]);

  const handleClose = () => { setIsOpen(false) };

  return (
    <>
      <div className='chat-container'>
        <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          <TbMessageFilled className='chat-icon' />
          {!isOpen && messageCount > 0 && (
            <span className='chat-badge'>{messageCount}</span>
          )}
        </div>

        {/* chat header */}
        <div className={`chat-box ${isOpen ? "open" : ""} ${isExpanded ? "expanded" : ""}`}>
          <div className='chat-header'>
            <span className='profile-icon'>
              <HiUser />
              {online && <span className="active-dot"></span>}
            </span>
            <div className='header-content'>
              <h5>{userRole === "Advisor" ? customerName : advisorName}</h5>
              <span>online</span>
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
              messages.map((msg, index) => {
                const isSelf = msg.sender === currentUserId;
                const messageClass = isSelf ? "Customer" : "Advisor";
                return (
                  <div key={index} className={`message ${messageClass}`}>
                    <span className="message-text">{msg.message}</span>
                    <span className="message-meta">
                      {msg.timestamp ? new Date(msg.modiefiedAt).toLocaleTimeString() : ""}
                    </span>
                  </div>
                );
              })
            )}
            {/* {typeLoading &&
              <span className="message advisor">typing...</span>} */}
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
