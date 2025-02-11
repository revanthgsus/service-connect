import React, { useState } from 'react';
import "./EditCustomer.css";
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown, IoMdArrowRoundBack } from "react-icons/io";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import dayjs from 'dayjs';
import API_BASE_URL from '../../../../../services/AuthService';
import { Formik, Form, ErrorMessage } from 'formik';
import { CustomerValidationSchema } from '../../../../../utils/FormValidation';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';

const EditCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerData } = location.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);

  const initialValues = {
    customerId: customerData?.customerId || '',
    userName: customerData?.userName || '',
    emailAddress: customerData?.emailAddress || '',
    mobileNumber: customerData?.mobileNumber || '',
    password: '',
    confirmPassword: '',
    joiningDate: customerData?.joiningDate ? dayjs(customerData.joiningDate) : null,
    addressLine1: customerData?.addressLine1 || '',
    addressLine2: customerData?.addressLine2 || '',
    city: customerData?.city || '',
    pincode: customerData?.pincode || '',
    state: customerData?.state || '',
    status: customerData?.status ? "Active" : "In Active",
  }

  const CustomerInfo = [
    {
      label: "User Name",
      name: "userName",
      placeholder: "Enter username",
      type: "text",
    },
    {
      label: "Email Address",
      name: "emailAddress",
      placeholder: "Enter email address",
      type: "email",
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      placeholder: "Enter mobile number",
      type: "text",
    },
    {
      label: "Password",
      name: "password",
      placeholder: "Enter password",
      type: "password",
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      placeholder: "Enter confirm password",
      type: "password",
    },
    {
      label: "Joining Date",
      name: "joiningDate",
      placeholder: "Enter joining date",
      type: "date",
    },
  ];

  const PersonalInfo = [
    {
      label: "Address Line 1",
      name: "addressLine1",
      placeholder: "Enter address",
      type: "text",
    },
    {
      label: "Address Line 2",
      name: "addressLine2",
      placeholder: "Enter address",
      type: "text",
    },
    {
      label: "City",
      name: "city",
      placeholder: "Enter city",
      type: "text",
    },
    {
      label: "Pincode",
      name: "pincode",
      placeholder: "Enter pincode",
      type: "text",
    },
    {
      label: "State",
      name: "state",
      placeholder: "Enter state",
      type: "text",
    },
    {
      label: "Status",
      name: "status",
      placeholder: "Select status",
      options: ["Active", "In Active"],
    },
  ];


  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please sign in to continue.");
      navigate('/')
      return;
    }

    const updatedValues = {
      ...values,
      joiningDate: values.joiningDate ? dayjs(values.joiningDate).format("YYYY-MM-DD") : "",
      status: values.status === "Active" ? true : false,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/addOrUpdateCustomerMaster`, updatedValues, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200 || response.data?.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/admin/customer");
        }, 1000);
      } else {
        toast.error((response.data?.error), {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          theme: "light",
        });
      }
    } catch (err) {
      toast.error("An error occurred while saving the data.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  const handleCancelClose = () => { setCancelShow(false); };

  const handleBack = (e) => {
    e.preventDefault();
    setCancelShow(true);
  }

  return (
    <>
      {loading ?
        (
          <PreLoader />
        ) : (
          <section className="edit-customer">
            <div className="edit-header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Edit Customer</h5>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={CustomerValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form>
                  <div className="edit-form">
                    <h5 className="editcustomer-heading">Customer Information</h5>
                    <Row className="add-fields">
                      {CustomerInfo.map((field, index) => (
                        <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                          <div className="input-wrapper">
                            <div className="form-group">
                              <label htmlFor={field.name}>{field.label}</label>
                              {field.name === "password" ? (
                                <div className="password-field">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    className="form-control"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur} />
                                  <span
                                    className="input-icon"
                                    onClick={() => setShowPassword(prevData => !prevData)}>
                                    {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                                  </span>
                                </div>
                              ) : field.name === "confirmPassword" ? (
                                <div className="password-field">
                                  <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    className="form-control"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <span
                                    className="input-icon"
                                    onClick={() => setShowConfirmPassword(prevData => !prevData)}
                                  >
                                    {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
                                  </span>
                                </div>
                              ) : field.name === "joiningDate" ? (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DemoContainer components={['DatePicker']}
                                    sx={{ paddingTop: "0px" }}>
                                    <DatePicker className="form-control date-picker"
                                      value={values.joiningDate ? dayjs(values.joiningDate) : null}
                                      onChange={(date) => {
                                        handleChange({
                                          target: {
                                            name: 'joiningDate',
                                            value: date ? dayjs(date).format("YYYY-MM-DD") : "",
                                          },
                                        });
                                      }}
                                      format='DD/MM/YYYY'
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          outline: "0",
                                          fontSize: "11px",
                                          paddingRight: "4px",
                                          "& fieldset": {
                                            border: "0px",
                                          },
                                          "& button": {
                                            padding: "5px 8px",
                                            "& svg": {
                                              width: "16px",
                                              color: "var(--input-icon-color)",
                                            },
                                          },
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                          borderColor: "transparent",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                          borderColor: "transparent",
                                        },
                                      }} />
                                  </DemoContainer>
                                </LocalizationProvider>
                              ) : field.options ? (
                                <div className="custom-select">
                                  <select
                                    id={field.name}
                                    name={field.name}
                                    className="form-control"
                                    onChange={handleChange}
                                    value={values[field.name]}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">{field.placeholder}</option>
                                    {field.options.map((option, idx) => (
                                      <option key={idx} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <IoIosArrowDown className="custom-arrow-icon" />
                                </div>
                              ) : (
                                <input
                                  id={field.name}
                                  type={field.type}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  className="form-control"
                                  value={values[field.name]}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    let newValue = e.target.value;
                                    if (field.name === "mobileNumber") {
                                      newValue = newValue.replace(/[^0-9]/g, "").slice(0, 10);
                                    }
                                    handleChange({ target: { name: field.name, value: newValue } });
                                  }}
                                />
                              )}
                              <ErrorMessage name={field.name} component="div" className="error-message" />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div className="edit-form mt-4">
                    <h5 className="editcustomer-heading">Personal Details</h5>
                    <Row className="add-fields">
                      {PersonalInfo.map((field, index) => (
                        <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                          <div className="input-wrapper">
                            <div className="form-group">
                              <label htmlFor={field.name}>{field.label}</label>
                              {field.options ? (
                                <div className="custom-select">
                                  <select
                                    id={field.name}
                                    name={field.name}
                                    className="form-control"
                                    value={values[field.name]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">{field.placeholder}</option>
                                    {field.options.map((option, idx) => (
                                      <option key={idx} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <IoIosArrowDown className="custom-arrow-icon" />
                                </div>
                              ) : (
                                <input
                                  id={field.name}
                                  type={field.type}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  value={values[field.name]}
                                  onBlur={handleBlur}
                                  className="form-control"
                                  readOnly={field.readOnly}
                                  onChange={(e) => {
                                    let newValue = e.target.value;
                                    if (field.name === "pincode") {
                                      newValue = newValue.replace(/[^0-9]/g, "").slice(0, 6);
                                    }
                                    handleChange({ target: { name: field.name, value: newValue } });
                                  }}
                                />
                              )}
                              <ErrorMessage name={field.name} component="div" className="error-message" />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div className="form-submit-button">
                    <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="save-button" disabled={loading}>Save</button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>)}

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default EditCustomer;
