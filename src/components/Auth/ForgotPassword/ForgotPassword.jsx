import React, { useState } from 'react';
import "../ForgotPassword/ForgotPassword.css";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.svg";
import { ReactComponent as ForgotImage } from "../../../assets/images/login/forgot-image.svg";
import { MdEmail } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Enter email address');
      setLoading(false);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9])*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const payload = {
      emailAddress: email,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/email/forgotPassword`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response?.data?.status === "success") {
        toast.success("OTP sent successfully!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          theme: "light",
        });

        setTimeout(() => {
          navigate('/get-otp', { state: { email: email } });
        }, 1000);
      } else {
        toast.error(response?.data?.message);
        setLoading(false)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />
      <section className='login-bg'>
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={4}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login-image" className='img-fluid login-image' height="auto" width="100%" />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={5}>
            <form className='login-form' onSubmit={handleSubmit}>
              <span className='back-span'>
                <Link to='/' className='back-btn'>
                  <IoArrowBack />Back
                </Link>
              </span>
              <ForgotImage className='forgot-image' />
              <h1>Forgot Your Password</h1>
              <div className='underline-animation'></div>
              <p>Please provide your email address, and we'll send you a link to reset your password</p>

              <div className='input-container'>
                <label htmlFor="email" className='form-label'>Email</label>
                <div className='input-wrapper'>
                  <span className='input-icon'><MdEmail /></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    autoComplete="email"
                    className='form-input'
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                {error && <span className='error-message'>{error}</span>}
              </div>

              <button type='submit' className='send-otp-btn'>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} sx={{ marginRight: 2 }} color="white" />Sending...</Box>
                ) : ("Send OTP")}
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

export default ForgotPassword;
