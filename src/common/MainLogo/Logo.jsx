import React from 'react';
import logo from "../../assets/images/logo/main-logo.svg";

const Logo = () => {
  return (
    <>
      <img src={logo} alt="main-logo" className="img-fluid main-logo" loading='lazy'/>
    </>
  )
}

export default Logo;