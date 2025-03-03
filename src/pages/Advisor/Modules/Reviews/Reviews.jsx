import React from 'react';
import './Reviews.css';
import { Box, Rating, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

const Reviews = () => {
  // const navigate = useNavigate();
  const ratingValue = 4.0;
  const totalRatings = 275;

  return (
    <>
      <section className='rating-toolbar'>
        <div className='rating-header'>
          <h6>Customer Ratings</h6>
        </div>
        <hr className='mt-1 horizontal-line' />
        <div className='rating-content'>
          <h2>{ratingValue.toFixed(1)}</h2>
          <Box>
            <Rating value={ratingValue} precision={0.1} readOnly />
            <Typography className='rating-number'>{totalRatings} Ratings</Typography>
          </Box>
        </div>
      </section>
    </>
  )
}

export default Reviews;