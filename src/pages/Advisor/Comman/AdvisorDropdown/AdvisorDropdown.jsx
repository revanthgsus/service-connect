import React, { useEffect, useRef, useState } from 'react';
import "./AdvisorDropdown.css";
import { BsPersonCircle } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import Logout from '../../../../common/Logout/Logout';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import API_BASE_URL from '../../../../services/AuthService';
import UPLOAD_FILE_API from '../../../../services/UploadFile';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AdvisorDropdown = ({ isOpen, toggleDropdown }) => {
  const [show, setShow] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");

  const setShowModal = () => { setShow(true) };
  const handleCloseModal = () => { setShow(false) };

  useEffect(() => {
    const fetchProfileImage = async () => {
      setLoading(true);

      // already checked all api token so no need to check again.

      try {
        const response = await axios.get(`${API_BASE_URL}/userMaster/getImageName/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.status === "success") {
          const imageId = response.data.imageName;
          const imageUrl = `${UPLOAD_FILE_API}/v1/view/${imageId}`;
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchProfileImage();
    }
  }, [userId, token]);

  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleDropdown]);

  return (
    <>
      <div className='advisor-dropdown' ref={dropdownRef}>
        <IconButton
          aria-label="Account"
          data-tooltip-id="account-tooltip"
          data-tooltip-content="Account"
          onClick={toggleDropdown}
          className="profile-icon"
          sx={{ padding: profileImage ? 0 : '8px' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
              onError={() => setProfileImage(null)}
            />
          ) : (
            <BsPersonCircle className="default-icon" />
          )}
        </IconButton>

        <div className={`dropdownfile ${isOpen ? 'show' : ''}`}>
          <ul>
            <li>
              <Link to="/advisor/profile" onClick={() => toggleDropdown(false)}>
                <AiOutlineUser />
                <span>View Profile</span>
              </Link>
            </li>

            <hr className="mt-0 mb-2" />
            <li className="logout-link" onClick={setShowModal}>
              <Link to='#'>
                <TbLogout />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Tooltip id="account-tooltip" className="custom-tooltip" />
      <Logout show={show} handleClose={handleCloseModal} />
    </>
  );
};

export default AdvisorDropdown;
