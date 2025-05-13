import React from 'react';
import './Banner.css'
import DashboardBanner from '../../assets/images/comman/hero-banner.png';

const Banner = () => {
  return (
    <>
      <div className='banner-container'>
        <img src={DashboardBanner} className='img-fluid banner-image' alt='banner-img' />

        <div className='banner-content'>
          <h5>Welcome to Service Connect !</h5>
          <p>Your One Stop Service Management <br /> Solution on One Platform</p>
        </div>
      </div>
    </>
  )
}

export default Banner;