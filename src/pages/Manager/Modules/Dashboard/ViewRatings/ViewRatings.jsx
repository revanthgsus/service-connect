import React from 'react';
import './ViewRatings.css';
import { IoMdArrowRoundBack } from 'react-icons/io';

const ViewRatings = () => {
  return (
    <section className="ratings-list">
      <div className='ratings-header'>
        <div className="header">
          <IoMdArrowRoundBack />
          <h5>Reviews & Ratings</h5>
        </div>
      </div>
    </section>
  )
}

export default ViewRatings