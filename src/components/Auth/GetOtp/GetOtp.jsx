import React, { useState } from 'react';
import '../GetOtp/GetOtp.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.svg";
import { ReactComponent as OtpImage } from "../../../assets/images/login/otp-image.svg";
import { IoArrowBack } from "react-icons/io5";
import { Row, Col } from 'react-bootstrap';
import API_BASE_URL from '../../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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

  // get-otp - handle submit api call
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

      if (response?.data?.status === "success") {
        toast.success("OTP Verified!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          theme: "light",
        });

        setTimeout(() => {
          navigate('/new-password', { state: { otp: otp } });
        }, 1000);
      } else {
        toast.error(response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong. Please try again.');
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
              {error && <span className="error-message">{error}</span>}

              <button type='submit' className='verify-otp-btn'>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} sx={{ marginRight: 2 }} color="white" />Verifying...</Box>
                ) : ("Verify OTP")}
              </button>
            </form>
          </Col>
        </Row>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
          theme="light"
        />
      </section>
    </>
  );
};

export default GetOtp;
