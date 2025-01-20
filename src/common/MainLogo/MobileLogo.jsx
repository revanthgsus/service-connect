import React from 'react';
import mobilelogo from "../../assets/images/logo/mobile-logo.png";

const MobileLogo = () => {
  return (
    <>
      <img src={mobilelogo} alt="mobile-logo" className="img-fluid mobile-logo" loading='lazy' />
    </>
  )
}

export default MobileLogo;