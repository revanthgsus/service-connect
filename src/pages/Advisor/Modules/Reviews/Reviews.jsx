import React, { useCallback, useEffect, useState } from 'react';
import './Reviews.css';
import { Box, Rating, Typography, SvgIcon, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PreLoader from '../../../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useAuth } from '../../../../contexts/AuthContext';
import { HiOutlineStar } from "react-icons/hi2";
import { BiSolidUserCircle } from "react-icons/bi";
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../../../../services/AuthService';

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

const Reviews = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const theme = useTheme();

  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = sessionStorage.getItem("userId");

  const fetchRatings = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/managerMaster/viewReviewsAndRatings/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


      if (response?.status === 200) {
        setAverageRating(response.data.overAllAverageRating || 0);
        setTotalRatings(response.data.noOfRatings || 0);
        setReviews(response?.data?.reviews || 0)
      } else {
        toast.error(response?.data?.message || "Failed to fetch rating data.")
      }
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false);
    }
  }, [setShowTokenModal, userId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);


  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1);
  };

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section section className='review-page'>
          <div className="header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Reviews & Ratings</h5>
          </div>

          <div className='header-container'>
            <h6>Customer Ratings</h6>
            <hr className='mt-1 horizontal-line' />
            <div className='rating-content'>
              <h2>{averageRating.toFixed(1)}</h2>
              <Box>
                <Rating value={totalRatings} precision={0.1} readOnly />
                <Typography className='rating-number'>{totalRatings} Ratings</Typography>
              </Box>
            </div>
          </div>

          <Row className='mt-3'>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div key={index} className='review-container'>
                    <div className='review-box'>
                      <div className='profile-container'>
                        <BiSolidUserCircle className="customer-img" />
                        <div className='profile-name'>
                          <h6>{review?.customerName || "Anonymous"}</h6>
                          <p>{review?.emailAddress || "Not Provided"}</p>
                        </div>
                      </div>

                      <div className='rating-value'>
                        <span className='rating-count'>{review.rating}</span>
                        <Box>
                          <Rating
                            value={review?.rating || 0}
                            precision={0.1}
                            readOnly
                            icon={<RoundedStar />}
                            emptyIcon={<HiOutlineStar
                              style={{ color: theme.palette.mode === 'dark' ? '#555' : '#ccc' }} />}
                          />
                        </Box>
                      </div>
                      <span className="review-content">{review.review || "No review provided"}</span>
                    </div>
                  </div>
                </Col >
              ))
            ) : (
              <p className='no-review'>No reviews available.</p>
            )}
          </Row >
        </section >
      )}

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  )
}

export default Reviews;