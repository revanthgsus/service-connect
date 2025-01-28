import React, { useState } from 'react';
import '../GetOtp/GetOtp.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.png";
import { ReactComponent as OtpImage } from "../../../assets/images/login/otp-image.svg";
import { IoArrowBack } from "react-icons/io5";
import { Row, Col } from 'react-bootstrap';
import API_BASE_URL from '../../../services/AuthService';

const GetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.some((digit) => digit === "")) {
      setError('Enter valid OTP');
      setLoading(false);
      return;
    }

    const payload = {
      emailAddress: email,
      token: otp.join("")
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/email/validateOtp`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        alert('OTP Verified');
        navigate('/new-password', { state: { otp: otp } });
      } else {
        setError('Failed to verify OTP, Try Again');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />
      <section className="login-bg">
        <Row className="loginpage-flex">
          <Col xxl={4} xl={4} lg={5} md={5}>
            <div className="bg-wave">
              <img
                src={loginImage}
                alt="login-image"
                className="img-fluid login-image"
                height="auto"
                width="100%"
              />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={5}>
            <form className="login-form" onSubmit={handleSubmit}>
              <span className="back-span">
                <Link to="/forgot-password" className="back-btn">
                  <IoArrowBack /> Back
                </Link>
              </span>
              <OtpImage className="getotp-image" />
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

              <button
                type="submit"
                className="verify-otp-btn"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {error && <p className="error-message">{error}</p>}
            </form>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default GetOtp;
