import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import { IoArrowBack } from "react-icons/io5";
import loginImage from "../../../assets/images/login/login-image.png";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "../NewPassword/NewPassword.css";
import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Successimage from "../../../assets/images/login/success-gif.gif";

const NewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handlePasswordToggle = (type) => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    setShowModal(false);
    navigate('/');
  };


  return (
    <>
      <Logo />
      <section className='login-bg'>
        <Row className='loginpage-flex'>
          <Col xxl={4} xl={4} lg={5} md={5}>
            <div className='bg-wave'>
              <img src={loginImage} alt="login-image" className='img-fluid login-image'
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
                    id="password"
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
                    id="confirmPassword"
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

      <Modal show={showModal} backdrop="static" className='update-password-modal'>
        <Modal.Header className='modal-header'>
          <img src={Successimage} alt='successimage' className='success-img' />
        </Modal.Header>
        <Modal.Body className='modal-body'>Your password has been successfully updated!</Modal.Body>
        <Modal.Footer className='modal-footer'>
          <button className='welcome-btn mx-auto' onClick={handleCloseModal}>
            Ok
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewPassword;
