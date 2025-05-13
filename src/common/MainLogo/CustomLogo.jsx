import React from 'react';
import Logodark from "../../assets/images/logo/logo-dark.svg";
import Logolight from "../../assets/images/logo/logo-light.svg";

const CustomLogo = ({ theme }) => {
  return (
    <>
      <img src={theme === 'dark' ? Logodark : Logolight}
        alt="customlogo"
        className='img-fluid customlogo'
        loading='lazy' />
    </>
  )
}

export default CustomLogo;