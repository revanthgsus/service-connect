import React, { useState } from 'react';
import "../LoginPage/LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.png";
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Row, Col } from 'react-bootstrap';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handlePasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = {
      admin: "admin@123",
      customer: "customer@123",
      manager: "manager@123",
      advisor: "advisor@123",
    };

    const { username, password } = formData;

    if (credentials[username] === password) {
      const roleRoutes = {
        admin: '/admin/dashboard',
        customer: '/customer/dashboard',
        manager: '/manager/dashboard',
        advisor: '/advisor/dashboard',
      };
      navigate(roleRoutes[username]);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <Logo />
      <section className='login-bg'>
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={4}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login" className='img-fluid login-image' height="auto" width="100%" />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={5}>
            <form className='login-form' onSubmit={handleSubmit}>
              <h1>Login to Service Connect</h1>
              <div className='underline-animation'></div>
              <p>Access your account to manage appointments and track customer satisfaction effortlessly, all in one place</p>

              <div className='input-container'>
                <label htmlFor="username" className="form-label">User Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <PersonIcon />
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-container">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon" onClick={handlePasswordToggle}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Link to='/forgot-password' className='forgot-link'>Forgot Password?</Link>
              <button type='submit' className='login-btn'>Login</button>
            </form>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default LoginPage;
