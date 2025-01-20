import React, { useState } from 'react';
import '../GetOtp/GetOtp.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.webp";
import otpimage from "../../../assets/images/login/otp-image.webp";
import { IoArrowBack } from "react-icons/io5";
import { Row, Col } from 'react-bootstrap';

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
      <Logo />
      <section className="login-bg">
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={5}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login-image" className='img-fluid login-image' loading='lazy'
                height="auto" width="100%" />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={5}>
            <form className="login-form" onSubmit={handleSubmit} >
              <span className="back-span">
                <Link to="/forgot-password" className="back-btn">
                  <IoArrowBack /> Back
                </Link>
              </span>
              <img src={otpimage} alt="getotp-image" className='getotp-image' loading='lazy'/>
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

              <button type="submit" className="verify-otp-btn">Verify OTP</button>
            </form>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default GetOtp;
