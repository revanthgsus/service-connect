import React from 'react';
import "../ForgotPassword/ForgotPassword.css";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import loginImage from "../../../assets/images/login/login-image.png";
import BackgroundColor from '../../../common/BackgroundColor/BackgroundColor';
import forgotImage from "../../../assets/images/login/forgot-image.png";
import { MdEmail } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const forgotpassword = [
    {
      label: "Email",
      name: "email",
      placeholder: "Enter email address",
      type: "email",
      autocomplete: "email",
      icon: <MdEmail />
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/get-otp');
  };


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
            <form className='login-form' >
              <span className='back-span'>
                <Link to='/' className='back-btn'><IoArrowBack />
                  Back</Link>
              </span>
              <img src={forgotImage} alt="forgot-image" className='img-fluid forgot-image' />
              <h1>Forgot Your Password</h1>
              <div className='underline-animation'></div>
              <p>Please provide your email address, and we'll send you a link to reset your password</p>
              {forgotpassword.map((field, index) => (
                <div key={index} className='input-container'>
                  <label htmlFor={field.name} className='form-label'>{field.label}</label>
                  <div className='input-wrapper'>
                    {field.icon && <span className='input-icon'>{field.icon}</span>}

                    <input
                      type={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      autoComplete={field.autocomplete}
                      className='form-input'
                    />
                  </div>
                </div>
              ))}
              <button type='submit' className='forgot-btn' onClick={handleSubmit}>Send OTP</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPassword;