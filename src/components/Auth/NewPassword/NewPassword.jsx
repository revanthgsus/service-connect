import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import { IoArrowBack } from "react-icons/io5";
import loginImage from "../../../assets/images/login/login-image.png";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "../NewPassword/NewPassword.css";
import { Row, Col } from 'react-bootstrap';

const NewPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newpassword = [
    {
      label: "New password",
      name: "password",
      placeholder: "Enter new password",
      type: "password",
      autocomplete: "password",
      showPassword: showPassword,
      setShowPassword: setShowPassword,
    },
    {
      label: "Confirm New Password",
      name: "confirmPassword",
      placeholder: "Confirm new password",
      type: "password",
      autocomplete: "password",
      showPassword: showConfirmPassword,
      setShowPassword: setShowConfirmPassword,
    }
  ];

  const handlePasswordToggle = (field) => {
    field.setShowPassword(prevState => !prevState);
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
              <img src={loginImage} alt="login-image" className='img-fluid login-image' />
            </div>
          </Col>
          <Col xxl={4} xl={5} lg={6} md={5}>
            <form className='login-form'onSubmit={handleSubmit}>
              <span className="back-span">
                <Link to="/forgot-password" className="back-btn">
                  <IoArrowBack /> Back
                </Link>
              </span>
              <h1 className='new-password-heading'>Set New Password</h1>
              <div className='underline-animation'></div>
              <p>Choose a strong, unique password to secure your personal information and keep your account safe.</p>
              {newpassword.map((field, index) => (
                <div key={index} className='input-container'>
                  <label htmlFor={field.name} className='form-label'>{field.label}</label>
                  <div className='input-wrapper'>
                    {field.name === "password" || field.name === "confirmPassword" ? (
                      <span className='input-icon' onClick={() => handlePasswordToggle(field)}>
                        {field.showPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    ) : null}
                    <input
                      type={field.showPassword ? "text" : field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      className='form-input'
                    />
                  </div>
                </div>
              ))}
              <button type='submit' className='update-pass-btn'>Update Password</button>
            </form>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default NewPassword;
