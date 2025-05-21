import React from 'react';
import Logodark from "../../assets/images/logo/logo-dark.svg";
import Logolight from "../../assets/images/logo/logo-light.svg";

const CustomLogo = ({ theme }) => {
  const logoSrc = theme === 'dark' ? Logodark : Logolight;

  return (
    <>
      <img
        key={theme}
        src={logoSrc}
        alt="customlogo"
        className='img-fluid customlogo'
        loading='lazy' />
    </>
  )
}

export default CustomLogo;