import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import { IoArrowBack } from "react-icons/io5";
import loginImage from "../../../assets/images/login/login-image.webp";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "../NewPassword/NewPassword.css";
import { Row, Col } from 'react-bootstrap';

const NewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordToggle = (type) => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <>
      <Logo />
      <section className='login-bg'>
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={5}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login-image" className='img-fluid login-image' loading='lazy'
                height="auto" width="100%" />
            </div>
          </Col>
          <Col xxl={5} xl={5} lg={6} md={5}>
            <form className='login-form' onSubmit={handleSubmit}>
              <span className="back-span">
                <Link to="/" className="back-btn">
                  <IoArrowBack /> Back
                </Link>
              </span>
              <h1 className='new-password-heading'>Set New Password</h1>
              <div className='underline-animation'></div>
              <p>Choose a strong, unique password to secure your personal information and keep your account safe.</p>

              <div className='input-container'>
                <label htmlFor="password" className='form-label'>New Password</label>
                <div className='input-wrapper'>
                  <span className='input-icon' onClick={() => handlePasswordToggle("password")}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    placeholder="Enter new password"
                    className='form-input'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className='input-container'>
                <label htmlFor="confirmPassword" className='form-label'>Confirm New Password</label>
                <div className='input-wrapper'>
                  <span className='input-icon' onClick={() => handlePasswordToggle("confirmPassword")}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    className='form-input'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type='submit' className='update-pass-btn'>Update Password</button>
            </form>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default NewPassword;
