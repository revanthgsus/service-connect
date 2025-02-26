import React, { useState } from 'react';
import { Box, Rating } from '@mui/material';
import Typography from '@mui/material/Typography';

const Ratings = () => {
  const [value, setValue] = useState(3);

  return (
    <>
      <section>
        <div className='rating-header'>
          <div className='password-header'>
            <h6>Customer Ratings</h6>
            <button>View All</button>
          </div>
          <hr className='mt-1 horizontal-line' />
        </div>
        <div>
          <h3>4.0</h3>
          <span>
            <Box sx={{ '& > legend': { mt: 2 } }}>
              <Typography component="legend">Read only</Typography>
              <Rating name="read-only" value={value} readOnly />
            </Box>
          </span>
        </div>
      </section>
    </>
  )
}

export default Ratings