import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./CreateAdvisor.css";
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown, IoMdArrowRoundBack } from "react-icons/io";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { Formik, Form, ErrorMessage } from 'formik';
import { AdvisorValidationSchema } from '../../../../../utils/FormValidation';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { toast, ToastContainer } from 'react-toastify';
import MultiSelect from './MultiSelect';
import { useAuth } from '../../../../../contexts/AuthContext';

const CreateAdvisor = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRole = sessionStorage.getItem("userRole");

  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const fieldRefs = useRef({});

  const initialValues = {
    userName: '',
    emailAddress: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    joiningDate: null,
    designation: 'Service Advisor',
    companyName: userRole === 'Chief Admin' ? sessionStorage.getItem("companyName") || '' : '',
    companyAddress: userRole === 'Chief Admin' ? sessionStorage.getItem("companyLocation") || '' : '',
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
      label: "Company Name",
      name: "companyName",
      placeholder: "Enter company name",
      type: "text",
      readOnly: userRole === 'Chief Admin',
    },
    {
      label: "Company Address",
      name: "companyAddress",
      placeholder: "Enter company address",
      type: "text",
      readOnly: userRole === 'Chief Admin',
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
  ];

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = Object.keys(formErrors).find(field => formTouched[field]);
      if (firstErrorField && fieldRefs.current[firstErrorField]) {
        setTimeout(() => {
          fieldRefs.current[firstErrorField].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [formErrors, formTouched]);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const updatedValues = {
      ...values,
      joiningDate: values.joiningDate ? dayjs(values.joiningDate).format('DD/MM/YYYY') : '',
      status: values.status === "Active",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/advisorMaster/addOrUpdateAdvisorMaster`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Advisor added successfully.");
        setTimeout(() => {
          navigate("/admin/advisor");
        }, 1000);
      } else {
        toast.error(response?.data?.error || "Failed to create advisor. Please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [navigate, setShowTokenModal])

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
      {loading ? (<PreLoader />
      ) : (
        <section className="create-advisor">
          <div className="create-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Create Advisor</h5>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={AdvisorValidationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, handleChange, setFieldValue, touched, errors }) => {
              setFormErrors(errors);
              setFormTouched(touched);
              return (
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
                                    ref={(el) => (fieldRefs.current[field.name] = el)} />
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
                                    ref={(el) => (fieldRefs.current[field.name] = el)}
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
                                  <DesktopDatePicker className="form-control date-picker"
                                    value={values.joiningDate ? dayjs(values.joiningDate) : null}
                                    onChange={(date) => setFieldValue("joiningDate", date)}
                                    format='DD/MM/YYYY'
                                    slotProps={{
                                      textField: {
                                        inputRef: (el) => (fieldRefs.current["joiningDate"] = el),
                                      },
                                    }}
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
                                </LocalizationProvider>
                              ) : (
                                <input
                                  id={field.name}
                                  type={field.type}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  className="form-control"
                                  value={values[field.name]}
                                  onChange={(e) => {
                                    let newValue = e.target.value;
                                    if (field.name === "mobileNumber") {
                                      newValue = newValue.replace(/[^0-9]/g, "").slice(0, 10);
                                    }
                                    handleChange({ target: { name: field.name, value: newValue } });
                                  }}
                                  ref={(el) => (fieldRefs.current[field.name] = el)}
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
                                    ref={(el) => (fieldRefs.current[field.name] = el)}
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
                                  ref={(el) => (fieldRefs.current[field.name] = el)}
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
                                  onChange={(newValue) => setFieldValue("serviceType", newValue)}
                                  ref={(el) => (fieldRefs.current[field.name] = el)} />
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
                </Form>)
            }}
          </Formik>
        </section>)}

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} theme="light" />
    </>
  );
};

export default CreateAdvisor;
