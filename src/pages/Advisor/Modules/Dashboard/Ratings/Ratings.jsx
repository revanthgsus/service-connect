import React, { useCallback, useEffect, useState } from 'react';
import './Ratings.css';
import { Box, Rating, Typography, SvgIcon, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HiOutlineStar } from "react-icons/hi2";
import { useAuth } from '../../../../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';

// Custom Rounded Star Icon
const RoundedStar = (props) => (
  <SvgIcon {...props}>
    <path
      d="M12 2.5c.5 0 1 .3 1.2.8l2.4 4.9 5.3.8c.5.1.9.5 1 1 .1.5-.1 1-.5 1.3l-3.8 3.7.9 5.3c.1.5-.1 1-.5 1.3-.4.3-.9.3-1.4.1L12 18.8l-4.8 2.5c-.5.2-1 .2-1.4-.1-.4-.3-.6-.8-.5-1.3l.9-5.3L2.4 11c-.4-.3-.6-.8-.5-1.3.1-.5.5-.9 1-1l5.3-.8 2.4-4.9c.2-.5.7-.8 1.2-.8z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
    />
  </SvgIcon>
);


const Ratings = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const theme = useTheme();
  const [ratingValue, setRatingValue] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  const fetchRatings = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/managerMaster/getOverAllAdvisorRatings/${companyName}/${companyLocation}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.status === 200) {
        setRatingValue(response?.data?.overAllAverageRating || 0);
        setTotalRatings(response?.data?.noOfRatings || 0);
      } else {
        toast.error(response?.data?.message || "Failed to fetch rating data.")
      }
    } catch {
      toast.error("Something went wrong. Please try again later.")
    }
  }, [setShowTokenModal, companyName, companyLocation]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate('reviews');
  };

  return (
    <>
      <section className='rating-toolbar'>
        <div className='rating-header'>
          <h6>Customer Ratings</h6>
          <button type='button' className='view-btn' onClick={handleClick}>
            View All
          </button>
        </div>

        <hr className='mt-1 horizontal-line' />
        <div className='rating-content'>
          <h2>{ratingValue.toFixed(1)}</h2>

          <Box>
            <Rating
              value={ratingValue}
              precision={0.1}
              readOnly
              icon={<RoundedStar />}
              emptyIcon={<HiOutlineStar style={{ color: theme.palette.mode === 'dark' ? '#555' : '#ccc' }} />}
            />
            <Typography className='rating-number'>{totalRatings} Ratings</Typography>
          </Box>
        </div>
      </section>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default Ratings;
