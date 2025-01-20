import React from 'react';
import customlogo from "../../assets/images/logo/main-logo.svg";

const CustomLogo = () => {
  return (
    <>
      <img src={customlogo} alt="customlogo" className='img-fluid customlogo' loading='lazy'/>
    </>
  )
}

export default CustomLogo;