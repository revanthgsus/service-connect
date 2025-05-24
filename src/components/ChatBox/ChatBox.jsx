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
import WEBSOCKET_URL from '../../services/WebSocket';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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
  // const [stompClient, setStompClient] = useState(null);
  const stompClientRef = useRef(null);
  const chatRef = useRef(null);

  const referenceId = sessionStorage.getItem("userId");
  const online = sessionStorage.getItem("online");
  const userRole = sessionStorage.getItem("userRole");
  const currentUserId = referenceId;
  const serviceId = quotesData?.data?.serviceId;
  const advisorName = quotesData?.data?.advisorName;
  const customerName = quotesData?.data?.customerName;


  // ---------- chat history api call --------- //

  const fetchChatHistory = useCallback(async () => {
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
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [serviceId, referenceId, setShowTokenModal]);


  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, fetchChatHistory]);


  // ---------- Web socket api connection api --------- //

  useEffect(() => {
    if (!serviceId || stompClientRef.current?.connected) return;

    const socket = new SockJS(`${WEBSOCKET_URL}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: str => console.log("[WebSocket Debug]:", str),

      onConnect: () => {
        console.log('WebSocket connected');

        client.subscribe(`/topic/messages/${serviceId}`, (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log('Received message:', payload);

            setMessages(prev => [...prev, {
              message: payload.message,
              sender: payload.referenceId,
              serviceId: payload.serviceId,
              // timestamp: payload.timestamp || new Date().toISOString(),
            }]);
          } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers['message']);
      }
    });
    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [serviceId]);



  // ---------- send message api call --------- //

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    // const token = sessionStorage.getItem("authToken");
    // if (!token) {
    //   setShowTokenModal(true);
    //   return;
    // }

    const payload = {
      message: input,
      referenceId: referenceId,
      serviceId: serviceId,
    };

    const client = stompClientRef.current;

    if (client && client.connected) {
      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload),
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      });

      setInput("");
      // fetchChatHistory();
    } else {
      toast.error("Failed to send message");
    }
  }, [input, referenceId, serviceId]);



  // ---------- Message count api call --------- //

  const fetchMessageCount = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!referenceId) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewMessagesByReferenceId/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setMessageCount(response.data.count);
      } else {
        setMessageCount(0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
      setMessageCount(0);
    }
  }, [referenceId, setShowTokenModal]);

  useEffect(() => {
    fetchMessageCount();
  }, [fetchMessageCount]);





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
