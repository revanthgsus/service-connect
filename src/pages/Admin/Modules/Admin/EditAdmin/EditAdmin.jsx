import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./EditAdmin.css";
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
import { AdminValidationSchema } from '../../../../../utils/FormValidation';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const EditAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowTokenModal } = useAuth();
  const { adminData } = location.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);

  const userRole = sessionStorage.getItem("userRole");

  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const fieldRefs = useRef({});

  const initialValues = {
    adminId: adminData?.adminId || '',
    userName: adminData?.userName || '',
    emailAddress: adminData?.emailAddress || '',
    mobileNumber: adminData?.mobileNumber || '',
    role: userRole === "Chief Admin" ? "Admin" : adminData?.role,
    location: adminData?.location || '',
    companyName: adminData?.companyName || '',
    joiningDate: adminData?.joiningDate ? dayjs(adminData.joiningDate, "DD/MM/YYYY") : null,
    password: '',
    confirmPassword: '',
    status: adminData?.status ? "Active" : "In Active",
  }

  const AdminInfo = [
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
      label: "Role",
      name: "role",
      placeholder: "Admin",
      options: ["Chief Admin"],
      readOnly: userRole === "Chief Admin",
    },
    {
      label: "Company Name",
      name: "companyName",
      placeholder: "Enter company name",
      type: "text",
      readOnly: true,
    },
    {
      label: "Location",
      name: "location",
      placeholder: "Enter location",
      type: "text",
    },
    {
      label: "Joining Date",
      name: "joiningDate",
      placeholder: "Enter joining date",
      type: "date",
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
        }, 500);
      }
    }
  }, [formErrors, formTouched]);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const updatedValues = {
      ...values,
      joiningDate: values.joiningDate ? dayjs(values.joiningDate).format("DD/MM/YYYY") : "",
      status: values.status === "Active",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/adminMaster/addOrUpdateAdminMaster`, updatedValues, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Admin Updated successfully.");
        setTimeout(() => { navigate("/admin/adminlist") }, 1000);
      } else {
        toast.error(response?.data?.error || "Failed to update admin. Please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [navigate, setShowTokenModal])

  const handleCancel = () => { setCancelShow(true) };
  const handleCancelClose = () => { setCancelShow(false) };
  const handleBack = () => { setCancelShow(true) };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="edit-admin">
          <div className="edit-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Edit Admin</h5>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={AdminValidationSchema}
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
                    <h5 className="editadmin-heading">Admin Information</h5>
                    <Row className="add-fields">
                      {AdminInfo.map((field, index) => (
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
                              ) : field.name === "role" && userRole === "Chief Admin" ? (
                                <input
                                  id="role"
                                  name="role"
                                  type="text"
                                  value="Admin"
                                  readOnly
                                  className="form-control"
                                />
                              ) : field.options ? (
                                <div className="custom-select">
                                  <select
                                    id={field.name}
                                    name={field.name}
                                    className="form-control"
                                    onChange={handleChange}
                                    value={values[field.name]}
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
                                  className="form-control"
                                  value={values[field.name]}
                                  ref={(el) => (fieldRefs.current[field.name] = el)}
                                  readOnly={field.readOnly}
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

export default EditAdmin;
