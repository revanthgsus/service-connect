import React, { useState } from 'react';
import "../LoginPage/LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.svg";
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Row, Col } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import API_BASE_URL from '../../../services/AuthService';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ username: '', password: '', general: '' });

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // login - handle submit api call function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ username: '', password: '', general: '' });

    if (!formData.username || !formData.password) {
      setError((prev) => ({
        ...prev,
        username: !formData.username ? 'User Name is required' : '',
        password: !formData.password ? 'Password is required' : '',
      }));
      setLoading(false);
      return;
    }

    const requestData = {
      userName: formData.username,
      password: formData.password
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/userMaster/loginAuthenticate`, requestData,
        {
          headers: { 'Content-Type': 'application/json' },
        });

      const { token, role, userId, userName, online, companyName, companyLocation } = response.data;

      if (token && role && userId && userName && online && companyName && companyLocation) {
        login(token, role, userId, userName, online, companyName, companyLocation);

        const roleRoutes = {
          "Super Admin": '/admin/dashboard',
          "Chief Admin": '/admin/dashboard',
          "Admin": '/admin/dashboard',
          "Customer": '/customer/dashboard',
          "Manager": '/manager/dashboard',
          "Advisor": '/advisor/dashboard',
        };
        const redirectTo = roleRoutes[response.data.role] || '/';

        toast.success("Login Successfully!", {
          position: "top-center",
          autoClose: 1000,
          theme: "light",
        });
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 1000);
      } else {
        setError((prev) => ({ ...prev, general: 'Invalid username and password' }));
        setLoading(false);
      }
    } catch (err) {
      setError((prev) => ({ ...prev, general: "Something went wrong. Please try again later.", }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />
      <section className='login-bg'>
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={7}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login" className='img-fluid login-image' height="auto" width="100%" loading='lazy' />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={8}>
            <form className='login-form' onSubmit={handleSubmit}>
              <h1>Login to Service Connect</h1>
              <div className='underline-animation'></div>
              <p>Access your account to manage appointments and track customer satisfaction effortlessly, all in one place</p>

              {/* user credential input */}
              <div className='input-container'>
                <label htmlFor="username" className="form-label">User Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className={`form-input ${error.username && "input-error"}`}
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                  <span className="input-icon">
                    <PersonIcon />
                  </span>
                </div>
                {error.username && <span className='error-message'>{error.username}</span>}
              </div>

              <div className="input-container">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    className={`form-input ${error.password && "input-error"}`}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <span className="input-icon" onClick={handlePasswordToggle}  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </div>
                {error.password && <span className='error-message'>{error.password}</span>}
                {error.general && <span className="error-message">{error.general}</span>}
              </div>

              <Link to='/forgot-password' className='forgot-link'>Forgot Password?</Link>
              <button type='submit' className='login-btn'>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} sx={{ marginRight: 2 }} color="white" />Logging in...</Box>
                ) : ("Login")}
              </button>
            </form>
          </Col>
        </Row>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          theme="light" />
      </section >
    </>
  );
};

export default LoginPage;
