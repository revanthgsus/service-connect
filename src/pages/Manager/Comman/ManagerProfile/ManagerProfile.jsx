import React, { useState } from 'react';
import './ManagerProfile.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Container, Col, Row } from 'react-bootstrap';
import { TbUserCircle } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import ProfileModal from '../../../../common/ProfileModal/ProfileModal';
import PasswordIcon from '../../../../assets/images/comman/empty-password.svg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ManagerProfile = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileDetails = [
    { title: "Role", value: "Service Manager" },
    { title: "Branch Name", value: "Main Branch" },
    { title: "Email Address", value: "manager@example.com" },
    { title: "Mobile Number", value: "9876543210" },
    { title: "Joining Date", value: "01/01/2024" }
  ];

  const handlePasswordToggle = (field) => {
    if (field === "current") setShowPassword((prev) => !prev);
    if (field === "new") setShowNewPassword((prev) => !prev);
    if (field === "confirm") setShowConfirmPassword((prev) => !prev);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <section className='manager-profile'>
      <div className="profile-header">
        <IoMdArrowRoundBack className="back-icon" />
        <h5>My Profile</h5>
      </div>
      <Container>
        <Row>
          <Col xxl={4} xl={4} lg={4} className='sidebar-align'>
            <div className="profile-sidebar">
              <h6 className='heading'>Personal Information</h6>
              <hr className='horizontal-line' />

              <div className='profile-container'>
                <div className="profile-image" onClick={() => setShowPopup(true)}>
                  {selectedImage ? (
                    <img src={selectedImage} alt="Profile" className="uploaded-image" />
                  ) : (
                    <TbUserCircle className="default-icon" />
                  )}
                  <input
                    type="file"
                    id='file'
                    accept="image/png, image/jpeg, image/jpg, image/svg, image/heif, image/heic"
                    onChange={handleFileChange} />
                  <span>
                    <CiEdit />
                  </span>
                </div>
              </div>

              <div className='profile-title'>
                <h6>Username</h6>
                <p>Location</p>
              </div>

              <div className="profile-details">
                {profileDetails.map((item, index) => (
                  <div key={index} className="profile-item">
                    <span className="profile-label">{item.title}</span>
                    <span className="profile-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col xxl={8} xl={8} lg={8} className="profile-content">
            <div className='password-header'>
              <h6>Change Password</h6>
              <span className='edit-icon' onClick={() => setShowPasswordFields(!showPasswordFields)}>
                <CiEdit />
              </span>
            </div>
            <hr className='mt-1 horizontal-line' />

            {!showPasswordFields ? (
              <div className='passoword-input'>
                <img src={PasswordIcon} alt='passwordicon' className='img-fluid' />
                <p>
                  <strong>Make it Unique - </strong>
                  Your password should be specific to your account and not reused across multiple services.</p>
              </div>
            ) : (
              <Row>
                <Col xxl={4} xl={4} lg={4}>
                  <div className="password-container">
                    <label htmlFor="current-password" className="password-label">Current Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="current-password"
                        placeholder="Enter password"
                        className='input-control'
                      />
                      <span className="password-icon" onClick={() => handlePasswordToggle("current")}  >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col xxl={4} xl={4} lg={4}>
                  <div className="password-container">
                    <label htmlFor="new-password" className="password-label">New Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="new-password"
                        placeholder="Enter password"
                        className='input-control'
                      />
                      <span className="password-icon" onClick={() => handlePasswordToggle("new")}  >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col xxl={4} xl={4} lg={4}>
                  <div className="password-container">
                    <label htmlFor="confirm-password" className="password-label">Confirm Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirm-password"
                        placeholder="Enter password"
                        className='input-control'
                      />
                      <span className="password-icon" onClick={() => handlePasswordToggle("confirm")}  >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      <ProfileModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        setSelectedImage={setSelectedImage}
        selectedImage={selectedImage} />
    </section>
  );
};

export default ManagerProfile;
