import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../common/MainLogo/Logo';
import { IoArrowBack } from "react-icons/io5";
import loginImage from "../../../assets/images/login/login-image.svg";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "../NewPassword/NewPassword.css";
import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import UpdatedImage from "../Updated.json";
import Lottie from 'react-lottie-player';
import axios from 'axios';
import API_BASE_URL from '../../../services/AuthService';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';

const NewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const otp = location.state?.otp;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordToggle = (type) => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  // new-password - handle submit api call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!password || !confirmPassword) {
      setError('Both fields are required.');
      setLoading(false);
      return;
    }

    // Validate password strength and matching
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {
      setError('Password: 8-12 chars, uppercase, numbers, special chars');
      setLoading(false);
      return;
    }

    const payload = {
      newPassword: password.trim(),
      confirmPassword: confirmPassword.trim(),
      token: otp.join(""),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/email/changePassword`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response?.data?.status === "success") {
        setShowModal(true);
      } else {
        toast.error(response?.data?.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
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
              <img src={loginImage} alt="login-image" className='img-fluid login-image' height="auto" width="100%" />
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
                {error && <div className="error-message">{error}</div>}
              </div>

              <button type='submit' className='update-pass-btn'>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} sx={{ marginRight: 2 }} color="white" />Updating...</Box>
                ) : ("Update Password")}
              </button>
            </form>
          </Col>
        </Row>
      </section>

      <Modal show={showModal} backdrop="static" className='update-password-modal'>
        <Modal.Header className='modal-header'>
          <Lottie animationData={UpdatedImage} loop={true} play={true} className="success-img" />
        </Modal.Header>
        <Modal.Body className='modal-body'>Your password has been successfully updated!</Modal.Body>
        <Modal.Footer className='modal-footer'>
          <button className='welcome-btn mx-auto' onClick={handleCloseModal}>
            Ok
          </button>
        </Modal.Footer>
      </Modal>


      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default NewPassword;
