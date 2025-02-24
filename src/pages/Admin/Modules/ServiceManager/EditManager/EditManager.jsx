import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./EditManager.css";
import { useLocation, useNavigate } from 'react-router-dom';
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
import { ManagerValidationSchema } from '../../../../../utils/FormValidation';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { toast, ToastContainer } from 'react-toastify';

const EditManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { managerData } = location.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const fieldRefs = useRef({});

  const initialValues = {
    managerId: managerData?.managerId || '',
    userName: managerData?.userName || '',
    emailAddress: managerData?.emailAddress || '',
    mobileNumber: managerData?.mobileNumber || '',
    password: '',
    confirmPassword: '',
    joiningDate: managerData?.joiningDate ? dayjs(managerData.joiningDate, "DD/MM/YYYY") : null,
    designation: "Service Manager",
    branchName: managerData?.branchName || '',
    branchLocation: managerData?.branchLocation || '',
    department: managerData?.department || '',
    status: managerData?.status ? "Active" : "In Active",
  }

  const ManagerInfo = [
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
      label: "Branch Location",
      name: "branchLocation",
      placeholder: "Enter branch location",
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

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Session expired. Please sign in again.", {
        autoClose: 2000,
      });
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const updatedValues = {
      ...values,
      joiningDate: values.joiningDate ? dayjs(values.joiningDate).format("DD/MM/YYYY") : '',
      status: values.status === "Active",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/addOrUpdateManagerMaster`, updatedValues, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response?.data?.status === "failed") {
        toast.error(response?.data?.error || "Failed to update manager. Please try again.", {
          style: { width: "100%" }, closeButton: false
        });
      } else if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Manager updated successfully.");
        setTimeout(() => {
          navigate("/admin/manager");
        }, 1000);
      } else {
        toast.error("Unexpected response. Please try again later.");
      }
    } catch (err) {
      toast.error("An error occurred while saving the data.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [navigate])

  const handleCancel = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  const handleCancelClose = () => { setCancelShow(false) };

  const handleBack = (e) => {
    e.preventDefault();
    setCancelShow(true);
  }

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="edit-manager">
          <div className="edit-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Edit Service Manager</h5>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={ManagerValidationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, handleChange, setFieldValue, touched, errors }) => {
              setFormErrors(errors);
              setFormTouched(touched);
              return (
                <Form>
                  <div className="edit-form">
                    <h5 className="editmanager-heading">Manager Information</h5>
                    <Row className="add-fields">
                      {ManagerInfo.map((field, index) => (
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
                                    value={values.joiningDate}
                                    onChange={(date) => setFieldValue("joiningDate", date || null)}
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
                                    if (field.name === 'mobileNumber') {
                                      const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                      handleChange({ target: { name: field.name, value: newValue } });
                                    } else {
                                      handleChange(e);
                                    }
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

                  <div className="edit-form mt-4">
                    <h5 className="editmanager-heading">Branch Information</h5>
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
                                  onChange={handleChange}
                                  ref={(el) => (fieldRefs.current[field.name] = el)}
                                  className="form-control"
                                  readOnly={field.readOnly}
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
                    <button type="submit" className="save-button">Save</button>
                  </div>
                </Form>)
            }}
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

export default EditManager;
