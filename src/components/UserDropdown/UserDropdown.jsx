import React, { useEffect, useRef, useState } from 'react';
import "./UserDropdown.css";
import { FaUserCircle } from "react-icons/fa";
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import Logout from '../../common/Logout/Logout';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import UPLOAD_FILE_API from '../../services/UploadFile';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { Box } from '@mui/material';

const UserDropdown = ({ isOpen, toggleDropdown }) => {
  const [show, setShow] = useState(false);
  const { setShowTokenModal } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef(null);
  const userId = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole")?.toLowerCase();

  const roleRouteMap = {
    'admin': 'admin',
    'chief admin': 'admin',
    'customer': 'customer',
    'advisor': 'advisor',
    'manager': 'manager',
  };

  const profilePath = `/${roleRouteMap[userRole]}/profile`;

  const setShowModal = () => { setShow(true) };
  const handleCloseModal = () => { setShow(false) };


  // profile picture api call
  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setShowTokenModal(true);
        return;
      }

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
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.log(error?.response?.data?.error || "Something went wrong. Please try again later.");
        setProfileImage(null);
      }
    };

    if (userId && setShowTokenModal) {
      fetchProfileImage();
    }
  }, [userId, setShowTokenModal]);


  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(false);
      }
    };

    if (isOpen) { document.addEventListener('mousedown', handleClickOutside) }
    return () => { document.removeEventListener('mousedown', handleClickOutside) };
  }, [isOpen, toggleDropdown]);


  return (
    <>
      <div className='userdropdown' ref={dropdownRef}>
        <IconButton
          aria-label="Account"
          data-tooltip-id="account-tooltip"
          data-tooltip-content="Account"
          onClick={toggleDropdown}
          className="profile-icon">

          {!imageError ? (
            <>
              {!imageLoaded && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={40} height={40} animation="pulse" />
                </Box>)}
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image"
                style={{ display: imageLoaded ? "block" : "none" }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <FaUserCircle className="default-icon" />
          )}
        </IconButton>

        <div className={`dropdownfile ${isOpen ? 'show' : ''}`}>
          <ul>
            {userRole !== 'super admin' && (
              <>
                <li>
                  <Link to={profilePath} onClick={() => toggleDropdown(false)}>
                    <AiOutlineUser />
                    <span>View Profile</span>
                  </Link>
                </li>
                <hr className="mt-0 mb-2" />
              </>
            )}

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
  )
}

export default UserDropdown