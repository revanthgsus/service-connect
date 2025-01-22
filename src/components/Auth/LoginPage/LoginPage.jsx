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
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [role, setRole] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(prevState => !prevState);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.username === "admin" && formData.password === "admin@123") {
      setSuccess(true);
      setRole('admin');
    } else if (formData.username === "customer" && formData.password === "customer@123") {
      setSuccess(true);
      setRole('customer');
    } else if (formData.username === "manager" && formData.password === "manager@123") {
      setSuccess(true);
      setRole("manager")
    } else if (formData.username === "advisor" && formData.password === "advisor@123") {
      setSuccess(true);
      setRole("advisor")
    } else {
      setSuccess(false);
      alert('Invalid credentials');
    }

    if (success) {
      if (role === "admin") {
        navigate('/admin/dashboard');
      }
      else if (role === "customer") {
        navigate('/customer/dashboard');
      }
      else if (role === "advisor") {
        navigate('/advisor/dashboard');
      }
      else if (role === "manager") {
        navigate('/manager/dashboard');
      }
      else {
        alert('Role not recognized');
      }
    }


  }
  return (
    <>
      <Logo />
      <section className='login-bg'>
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={4}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login-image" className='img-fluid login-image'
                height="auto" width="100%" />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={5}>
            <form className='login-form' onSubmit={handleSubmit}>
              <h1>Login to Service Connect</h1>
              <div className='underline-animation'></div>
              <p>Access your account to manage appointments and track customer satisfaction effortlessly, all in one place</p>
              <div className='input-container'>
                <label htmlFor="username" className="form-label">
                  User Name
                </label>
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
                <label htmlFor="password" className="form-label">
                  Password
                </label>
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
            </form></Col>
        </Row>
      </section>
    </>
  );
}

export default LoginPage;
