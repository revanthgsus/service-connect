import React, { useState } from 'react';
import '../GetOtp/GetOtp.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.png";
import BackgroundColor from '../../../common/BackgroundColor/BackgroundColor';
import otpimage from "../../../assets/images/login/otp-image.png";
import { IoArrowBack } from "react-icons/io5";

const GetOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // add number
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // deletenumber
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/new-password');
  };

  return (
    <>
      <section className="login-bg">
        <Logo />
        <BackgroundColor />
        <div className="form-alignment">
          <div className="bg-wave">
            <img src={loginImage} alt="login" className="img-fluid login-image" />
          </div>
          <div>
            <form className="login-form" >
              <span className="back-span">
                <Link to="/forgot-password" className="back-btn">
                  <IoArrowBack /> Back
                </Link>
              </span>
              <img src={otpimage} alt="otp-image" className='img-fluid forgot-image' />

              <h1>Enter Your OTP</h1>
              <div className="underline-animation"></div>
              <p>We've sent a verification OTP to your email. Please check your inbox and enter the OTP to verify your email address.</p>
              <div className="otp-input-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="otp-input"
                  />
                ))}
              </div>

              <button type="submit" className="otp-btn" onClick={handleSubmit}>Verify OTP</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetOtp;
