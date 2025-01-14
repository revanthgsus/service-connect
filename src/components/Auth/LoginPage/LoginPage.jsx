import React, { useState } from 'react';
import "../LoginPage/LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.png";
import BackgroundColor from '../../../common/BackgroundColor/BackgroundColor';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const authentication = [
    {
      label: "User Name",
      name: "username",
      placeholder: "Enter your username",
      type: "text",
      autocomplete: "username",
      icon: <PersonIcon />
    },
    {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      type: "password",
      autocomplete: "password"
    }
  ];

  const handlePasswordToggle = () => {
    setShowPassword(prevState => !prevState);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  }
  return (
    <>
      <section className='login-bg'>
        <Logo />
        <BackgroundColor />
        <div className='form-alignment'>
          <div className='bg-wave'>
            <img src={loginImage} alt="login-image" className='img-fluid login-image' />
          </div>
          <div>
            <form className='login-form' onSubmit={handleSubmit}>
              <h1>Login to Service Connect</h1>
              <div className='underline-animation'></div>
              <p>Access your account to manage appointments and track customer satisfaction effortlessly, all in one place</p>
              {authentication.map((field, index) => (
                <div key={index} className='input-container'>
                  <label htmlFor={field.name} className='form-label'>{field.label}</label>
                  <div className='input-wrapper'>
                    {field.icon && <span className='input-icon'>{field.icon}</span>}
                    {field.name === "password" && (
                      <span className='input-icon' onClick={handlePasswordToggle}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    )}
                    <input
                      type={field.name === "password" && showPassword ? "text" : field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      className='form-input'
                    />
                  </div>
                </div>
              ))}

              <Link to='/forgot-password' className='forgot-link'>Forgot Password?</Link>
              <button type='submit' className='login-btn'>Login</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
