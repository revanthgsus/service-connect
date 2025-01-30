import React, { useState } from 'react';
import "../CreateManager/CreateManager.css";
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown } from "react-icons/io";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import CancelModal from '../../../Common/CancelModal/CancelModal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { Formik, Form, ErrorMessage } from 'formik';
import ManagerValidationSchema from '../../../../../utils/FormValidation';
import PreLoader from '../../../../../common/PreLoader/PreLoader';

const CreateManager = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);

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
      placeholder: "Select designation",
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

  const handleDateChange = (date, setFieldValue) => {
    setFieldValue("joiningDate", date ? date.format("YYYY-MM-DD") : "");
  };

  const handleSubmit = async (values) => {
    const updatedValues = {
      ...values,
      status: values.status === "Active" ? true : false,
    };
    setLoading(true);
    console.log(values)

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert("Auth token is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/addOrUpdateManagerMaster`, updatedValues, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        navigate("/admin/manager");
      }
    } catch (err) {
      alert("An error occurred while saving the data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  const handleCancelClose = () => {
    setCancelShow(false);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  return (
    <>
      {loading ? (<PreLoader />) : ("")}
      <section className="create-manager">
        <div className="create-header">
          <IoMdArrowRoundBack onClick={handleBack} />
          <h5>Create Service Manager</h5>
        </div>
        <Formik
          initialValues={{
            userName: '',
            emailAddress: '',
            mobileNumber: '',
            password: '',
            confirmPassword: '',
            joiningDate: '',
            designation: 'Service Manager',
            branchName: '',
            branchLocation: '',
            department: '',
            status: '',
          }}
          validationSchema={ManagerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <div className="create-form">
                <h5 className="addmanager-heading">Manager Information</h5>
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
                                onBlur={handleBlur}
                              />
                              <span
                                className="input-icon"
                                onClick={() => setShowPassword(prevData => !prevData)}
                              >
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
                          ) : field.type === "date" ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                className="form-control date-picker"
                                format="DD/MM/YYYY"
                                id="joiningdate"
                                value={values.joiningDate ? dayjs(values.joiningDate) : null}
                                onChange={(date) => handleDateChange(date, setFieldValue)}
                                onBlur={handleBlur}
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
                                }}
                              />
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
                                if (field.name === 'mobileNumber') {
                                  const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                  handleChange({ target: { name: field.name, value: newValue } });
                                } else {
                                  handleChange(e);
                                }
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
                <h5 className="addmanager-heading">Branch Information</h5>
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
                              onChange={handleChange}
                              onBlur={handleBlur}
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
            </Form>
          )}
        </Formik>
      </section>

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
    </>
  );
};

export default CreateManager;
