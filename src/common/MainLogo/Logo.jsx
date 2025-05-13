import React from 'react';
import logo from "../../assets/images/logo/logo-light.svg";

const Logo = () => {
  return (
    <>
      <img src={logo} alt="main-logo" className="img-fluid main-logo" loading='lazy' />
    </>
  )
}

export default Logo;