import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateAdvisor.css";
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown, IoMdArrowRoundBack } from "react-icons/io";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import dayjs from 'dayjs';
import API_BASE_URL from '../../../../../services/AuthService';
import { Formik, Form, ErrorMessage } from 'formik';
import { AdvisorValidationSchema } from '../../../../../utils/FormValidation';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import MultiSelect from './MultiSelect';

const CreateAdvisor = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    userName: '',
    emailAddress: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    joiningDate: null,
    designation: 'Service Advisor',
    branchName: '',
    branchAddress: '',
    pincode: '',
    department: '',
    serviceType: '',
    status: '',
  }

  const AdvisorInfo = [
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

  const BranchInfo = [
    {
      label: "Designation",
      name: "designation",
      placeholder: "Enter designation",
      type: "text",
      readOnly: true,
    },
    {
      label: "Branch Name",
      name: "branchName",
      placeholder: "Enter branch name",
      type: "text",
    },
    {
      label: "Branch Address",
      name: "branchAddress",
      placeholder: "Enter branch address",
      type: "text",
    },
    {
      label: "Pincode",
      name: "pincode",
      placeholder: "Enter pincode",
      type: "text",
    },
    {
      label: "Department",
      name: "department",
      placeholder: "Enter department",
      type: "text",
    },
    {
      label: "Status",
      name: "status",
      placeholder: "Select status",
      options: ["Active", "In Active"],
    },
  ];

  const ServiceType = [
    {
      label: "Service Type",
      name: "serviceType",
      placeholder: "Enter servive type",
      type: "mutli-select",
    },
  ]

  const handleSubmit = async (values) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Session expired. Please sign in to continue.");
      navigate('/');
      return;
    }

    const updatedValues = {
      ...values,
      joiningDate: values.joiningDate ? dayjs(values.joiningDate).format('DD/MM/YYYY') : '',
      status: values.status === "Active",
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/advisorMaster/addOrUpdateAdvisorMaster`,
        updatedValues,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.data?.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/admin/advisor");
        }, 1000);
      } else {
        toast.error(response.data?.error, {
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

  const handleCancelClose = () => { setCancelShow(false) };

  const handleBack = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  return (
    <>
      {loading ?
        (
          <PreLoader />
        ) : (
          <section className="create-advisor">
            <div className="create-header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Create Service Advisor</h5>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={AdvisorValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  <div className="create-form">
                    <h5 className="addadvisor-heading">Advisor Information</h5>
                    <Row className="add-fields">
                      {AdvisorInfo.map((field, index) => (
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
                                      onChange={(date) => setFieldValue("joiningDate", date)}
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

                  <div className="create-form mt-4">
                    <h5 className="addadvisor-heading">Branch Information</h5>
                    <Row className="add-fields">
                      {BranchInfo.map((field, index) => (
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

                      {ServiceType.map((field, index) => (
                        <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                          <div className="input-wrapper">
                            <div className="form-group">
                              <label htmlFor="serviceType">Service Type</label>
                              <div className="multi-select-wrapper">
                                <MultiSelect
                                  selectedValues={values.serviceType}
                                  onChange={(newValue) => setFieldValue("serviceType", newValue)} />
                              </div>
                              <ErrorMessage name={field.name} component="div" className="error-message" />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div className="form-submit-button">
                    <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="save-button">Save</button>
                  </div>
                </Form>)}
            </Formik>
          </section>)}

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} theme="light" />
    </>
  );
};

export default CreateAdvisor;
