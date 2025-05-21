import React, { useEffect, useRef, useState } from 'react';
import './UserProfile.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Container, Col, Row } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import PasswordIcon from '../../assets/images/comman/empty-password.svg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PreLoader from '../../common/PreLoader/PreLoader';
import { ToastContainer, toast } from 'react-toastify';
import { Form, Formik, ErrorMessage } from 'formik';
import { PasswordValidation } from '../../utils/passwordValidation';
import { useNavigate } from 'react-router-dom';
import useUserProfile from '../../hooks/useUserProfile';
import useMediaUpload from '../../hooks/useMediaUpload';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ProfileModal from '../../common/ProfileModal/ProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import { Dropdown } from 'react-bootstrap';
import UPLOAD_FILE_API from '../../services/UploadFile';

const UserProfile = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const userId = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole");

  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const { isLoading } = useUserProfile(userId, setUser, setSelectedImage);
  const { uploadMediaFile } = useMediaUpload(userId, setUser, setSelectedImage);
  const [imageLoading, setImageLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const fieldRefs = useRef({});

  const [tempImageUrl, setTempImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const profileDetails = [
    { title: "User Id", value: userId || "-" },
    { title: "Email Address", value: user?.emailAddress || "-" },
    { title: "Mobile Number", value: user?.mobileNumber || "-" },
    { title: "Joining Date", value: user?.joiningDate || "-" }
  ];

  const handlePasswordToggle = (field) => {
    if (field === "current") setShowPassword((prev) => !prev);
    if (field === "new") setShowNewPassword((prev) => !prev);
    if (field === "confirm") setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = Object.keys(formErrors).find(field => formTouched[field]);
      if (firstErrorField && fieldRefs.current[firstErrorField]) {
        setTimeout(() => {
          fieldRefs.current[firstErrorField].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [formErrors, formTouched]);


  // handle password change api call
  const handlePasswordUpdate = async (values, { setSubmitting }) => {
    const token = sessionStorage.getItem("authToken");
    if (!token || !userId) {
      setShowTokenModal(true);
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    const payload = {
      userId: userId,
      currentPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/email/viewProfileChangePassword`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

      if (response?.data?.status === "success") {
        toast.success("Password updated successfully.");
        setShowPasswordFields(false);
      } else {
        toast.error(response?.data?.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleImageError = () => {
    setImageLoading(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev, profileImageUrl: null }));
      setSelectedImage(null);
      setImageLoading(false);
    }, 0);
  };


  const handleUploadClick = () => { fileInputRef.current?.click() };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size < 1MB
    if (file.size > 1 * 1024 * 1024) {
      toast.error('File size exceeds 1MB. Please choose a smaller image.');
      e.target.value = null;
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Unsupported image type.');
      e.target.value = null;
      return;
    }

    // Create temporary URL for cropping modal
    const imageUrl = URL.createObjectURL(file);
    setTempImageUrl(imageUrl);
    setShowPopup(true);
    e.target.value = null;
  };


  console.log(user);

  // delete image api call
  const handleDeleteImage = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    // if (!user?.imageId) {
    //   toast.error("No image to delete.");
    //   return;
    // }


    try {
      const response = await axios.delete(`${UPLOAD_FILE_API}/v1/delete/profile_MNGR_00004.png`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });


      if (response?.data?.status === "success") {
        toast.success("Profile image deleted successfully.");
        setUser(prev => ({ ...prev, profileImageUrl: null }));
        setSelectedImage(null);
      } else {
        toast.error(response?.data?.message || "Failed to delete profile image.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    }
  };


  return (
    <>
      {isLoading ? (<PreLoader />) : (
        <section className='user-profile'>
          <div className="profile-header">
            <IoMdArrowRoundBack className="back-icon" onClick={() => navigate(-1)} />
            <h5>My Profile</h5>
          </div>

          <Container fluid>
            <Row>
              <Col xxl={4} xl={4} lg={4} md={6} sm={6} className='sidebar-align'>
                <div className="profile-sidebar">
                  <h6 className='heading'>Personal Information</h6>
                  <hr className='horizontal-line' />
                  <div className='profile-container'>
                    <div className="profile-image">
                      {user?.profileImageUrl && !imageLoading && (
                        <Box>
                          <CircularProgress size={20} />
                        </Box>
                      )}
                      {user?.profileImageUrl ? (
                        <img
                          src={user?.profileImageUrl}
                          alt=""
                          className="uploaded-image"
                          style={{ display: imageLoading ? 'block' : 'none' }}
                          onLoad={() => setImageLoading(true)}
                          onError={handleImageError}
                        />
                      ) : (
                        <FaUserCircle className="default-icon" />
                      )}

                      <Dropdown className="edit-dropdown" >
                        <Dropdown.Toggle variant="link" className="edit-toggle" bsPrefix="p-0">
                          <CiEdit className="edit-icon" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            className="custom-dropdown"
                            onClick={handleUploadClick}>Upload Image</Dropdown.Item>
                          <Dropdown.Item className="delete-dropdown"
                            onClick={handleDeleteImage}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      <input
                        type="file"
                        id="fileInput"
                        accept="image/png, image/jpeg, image/svg+xml, image/heif, image/webp"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileSelected}
                      />
                    </div>
                  </div>

                  <div className='profile-title'>
                    <h6>{user?.userName || "Username"}</h6>
                    <p>{(userRole === "Admin" || userRole === "Chief Admin") &&
                      (user?.location || "Location")}
                      {userRole === "Customer" && (user?.city || "Location")}
                      {userRole === "Advisor" && (user?.companyAddress || "Location")}
                      {userRole === "Manager" && (user?.companyLocation || "Company Address")}
                    </p>
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

              <Col xxl={8} xl={8} lg={8} md={6} sm={6} className="profile-content">
                <div className="profile-sidebar">
                  <div className='password-header'>
                    <h6>Change Password</h6>
                    <span className='edit-icon' onClick={() => setShowPasswordFields(!showPasswordFields)}>
                      <CiEdit />
                    </span>
                  </div>
                  <hr className='mt-1 horizontal-line' />

                  {/* password field to open toggle */}
                  {!showPasswordFields ? (
                    <div className='passoword-input'>
                      <img src={PasswordIcon} alt='passwordicon' className='img-fluid' />
                      <p>
                        <strong>Make it Unique - </strong>
                        Your password should be specific to your account and not reused across multiple services.</p>
                    </div>
                  ) : (
                    <Formik
                      initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                      validationSchema={PasswordValidation}
                      onSubmit={handlePasswordUpdate}
                      validateOnChange={true}
                      validateOnBlur={true}
                    >
                      {({ handleChange, touched, errors, isSubmitting }) => {
                        setFormErrors(errors);
                        setFormTouched(touched);
                        return (
                          <Form>
                            <Row>
                              <Col xxl={4} xl={4} lg={4}>
                                <div className="password-container">
                                  <label htmlFor="currentPassword" className="password-label">Current Password</label>
                                  <div className="password-wrapper">
                                    <input
                                      type={showPassword ? 'text' : 'password'}
                                      name="currentPassword"
                                      placeholder="Enter password"
                                      className='input-control'
                                      onChange={handleChange}
                                    />
                                    <span className="password-icon" onClick={() => handlePasswordToggle("current")}  >
                                      {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                    <ErrorMessage name="currentPassword" component="div" className="error-message" />
                                  </div>
                                </div>
                              </Col>

                              <Col xxl={4} xl={4} lg={4} >
                                <div className="password-container">
                                  <label htmlFor="newPassword" className="password-label">New Password</label>
                                  <div className="password-wrapper">
                                    <input
                                      type={showNewPassword ? 'text' : 'password'}
                                      name="newPassword"
                                      placeholder="Enter password"
                                      className='input-control'
                                      onChange={handleChange}
                                    />
                                    <span className="password-icon" onClick={() => handlePasswordToggle("new")}  >
                                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                    <ErrorMessage name="newPassword" component="div" className="error-message" />
                                  </div>
                                </div>
                              </Col>

                              <Col xxl={4} xl={4} lg={4} >
                                <div className="password-container">
                                  <label htmlFor="confirmPassword" className="password-label">Confirm Password</label>
                                  <div className="password-wrapper">
                                    <input
                                      type={showConfirmPassword ? 'text' : 'password'}
                                      name="confirmPassword"
                                      placeholder="Enter password"
                                      className='input-control'
                                      onChange={handleChange}
                                    />
                                    <span className="password-icon" onClick={() => handlePasswordToggle("confirm")}  >
                                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <div class="save-btn-container">
                              <button type="button" class="cancel-button"
                                onClick={() => setShowPasswordFields(false)}>
                                Cancel
                              </button>
                              <button type="submit" className="save-button" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </Form>
                        )
                      }}
                    </Formik>
                  )}
                </div>
              </Col>
            </Row>
          </Container>

          <ProfileModal
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            uploadMediaFile={uploadMediaFile}
            tempImageUrl={tempImageUrl}
          />
        </section>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        theme="light" />
    </>
  );
};

export default UserProfile;
