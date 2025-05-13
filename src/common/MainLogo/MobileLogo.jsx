import React from 'react';
import mobilelogolight from "../../assets/images/logo/mobile-light.svg";
import mobilelogodark from "../../assets/images/logo/mobile-dark.svg";

const MobileLogo = ({ theme }) => {
  return (
    <>
      <img src={theme === 'dark' ? mobilelogodark : mobilelogolight}
        alt="mobile-logo"
        className="img-fluid mobile-logo"
        loading='lazy' />
    </>
  )
}

export default MobileLogo;