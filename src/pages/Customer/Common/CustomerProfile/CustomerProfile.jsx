import React, { useEffect, useRef, useState } from 'react';
import './CustomerProfile.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Container, Col, Row } from 'react-bootstrap';
import { TbUserCircle } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import ProfileModal from '../../../../common/ProfileModal/ProfileModal';
import PasswordIcon from '../../../../assets/images/comman/empty-password.svg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PreLoader from '../../../../common/PreLoader/PreLoader';
import { ToastContainer, toast } from 'react-toastify';
import useCustomerProfile from '../../../../hooks/useCustomerProfile';
import usePasswordUpdate from '../../../../hooks/usePasswordUpdate';
import useMediaUpload from '../../../../hooks/useMediaUpload';
import { Form, Formik, ErrorMessage } from 'formik';
import { PasswordValidation } from '../../../../utils/passwordValidation';

const CustomerProfile = () => {
  const userId = localStorage.getItem("userId");
  const [customer, setCustomer] = useState({});
  const { isLoading } = useCustomerProfile(userId, setCustomer);
  const { updatePassword } = usePasswordUpdate(userId);
  const { uploadMediaFile, viewMedia } = useMediaUpload(userId, setCustomer);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const fieldRefs = useRef({});

  useEffect(() => {
    viewMedia();
  }, [viewMedia])

  const profileDetails = [
    { title: "Email Address", value: customer?.emailAddress || "N/A" },
    { title: "Mobile Number", value: customer?.mobileNumber || "N/A" },
    { title: "Joining Date", value: customer?.joiningDate || "N/A" }
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

  const handlePasswordUpdate = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }
    try {
      await updatePassword(currentPassword, newPassword);
      // toast.success("Password updated successfully!");
      // setShowPasswordFields(false);
    } catch (error) {
      toast.error("Failed to update password. Try again.");
    }
  };

  return (
    <>
      {isLoading ? (<PreLoader />) : (
        <section className='customer-profile'>
          <div className="profile-header">
            <IoMdArrowRoundBack className="back-icon" />
            <h5>My Profile</h5>
          </div>
          <Container fluid>
            <Row>
              <Col xxl={4} xl={4} lg={4} md={6} sm={6} className='sidebar-align'>
                <div className="profile-sidebar">
                  <h6 className='heading'>Personal Information</h6>
                  <hr className='horizontal-line' />
                  <div className='profile-container'>
                    <div className="profile-image" onClick={() => setShowPopup(true)}>
                      {selectedImage || customer?.profileImageUrl ? (
                        <img src={selectedImage || customer?.profileImageUrl} alt="Profile" className="uploaded-image" />
                      ) : (
                        <TbUserCircle className="default-icon" />
                      )}
                      <span><CiEdit /></span>
                    </div>
                  </div>
                  <div className='profile-title'>
                    <h6>{customer?.userName || "Username"}</h6>
                    <p>{customer?.city || "Location"}</p>
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
                    >
                      {({ handleChange, touched, errors }) => {
                        setFormErrors(errors);
                        setFormTouched(touched);
                        return (
                          <Form>
                            <Row>
                              <Col xxl={4} xl={4} lg={4} >
                                <div className="password-container">
                                  <label htmlFor="current-password" className="password-label">Current Password</label>
                                  <div className="password-wrapper">
                                    <input
                                      type={showPassword ? 'text' : 'password'}
                                      name="current-password"
                                      placeholder="Enter password"
                                      onChange={handleChange}
                                      className='input-control'
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
                                  <label htmlFor="new-password" className="password-label">New Password</label>
                                  <div className="password-wrapper">
                                    <input
                                      type={showNewPassword ? 'text' : 'password'}
                                      name="new-password"
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
                                  <label htmlFor="confirm-password" className="password-label">Confirm Password</label>
                                  <div className="password-wrapper">
                                    <input
                                      type={showConfirmPassword ? 'text' : 'password'}
                                      name="confirm-password"
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
                              <button type="submit" class="cancel-button"
                                onClick={() => setShowPasswordFields(false)}>
                                Cancel
                              </button>
                              <button type="submit" class="save-button" onClick={handlePasswordUpdate}>
                                Save
                              </button>
                            </div>
                          </Form>)
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
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            uploadMediaFile={uploadMediaFile} />
        </section>
      )}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light" />
    </>
  );
};

export default CustomerProfile;
