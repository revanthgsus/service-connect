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
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';

const CreateManager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [cancelShow, setCancelShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    userName: 'Naveen',
    emailAddress: 'revanth@gmail.com',
    mobileNumber: '8056812595',
    password: 'Revanth@675',
    confirmPassword: 'Revanth@675',
    joiningDate: '23/12/2022',
    designation: 'Service Manager',
    branchName: 'chennai',
    branchLocation: 'chennai',
    status: 'true'
  })

  const ManagerInfo = [
    {
      label: "User Name",
      name: "username",
      placeholder: "Enter username",
      type: "text",
    },
    {
      label: "Email Address",
      name: "emailaddress",
      placeholder: "Enter email address",
      type: "email",
    },
    {
      label: "Mobile Number",
      name: "mobilenumber",
      placeholder: "Enter mobile number",
      type: "number",
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
      name: "joiningdate",
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
    },
    {
      label: "Branch Name",
      name: "branchname",
      placeholder: "Enter branch name",
      type: "text",
    },
    {
      label: "Branch Location",
      name: "branchlocation",
      placeholder: "Enter branch location",
      type: "text",
    },
    {
      label: "Department",
      name: "Department",
      placeholder: "Enter department",
      type: "text",
    },
    {
      label: "Status",
      name: "status",
      placeholder: "Select status",
      options: [
        "Active",
        "In Active"
      ],
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log("sda", formData)

    const token = sessionStorage.getItem('token');

    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/addOrUpdateManagerMaster`, formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response);

      if (response.status === 200) {
        console.log(response)
        navigate("/admin/service-manager");
      } else {
        alert("Error adding manager");
      }
    } catch (err) {
      setError("An error occurred while saving the data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCancelShow(true);
  }

  const handleCancelClose = () => {
    setCancelShow(false);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setCancelShow(true);
  }

  return (
    <>
      <section className='create-manager'>
        <div className='create-header'>
          <IoMdArrowRoundBack onClick={handleBack} />
          <h5>Create Service Manager</h5>
        </div>
        <form>
          <div className='create-form'>
            <h5 className='addmanager-heading'>Manager Information</h5>
            <Row className='add-fields'>
              {ManagerInfo.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className='input-wrapper'>
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
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <span className='input-icon' onClick={() => setShowPassword(prevData => !prevData)}>
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
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                          <span className='input-icon' onClick={() => setShowConfirmPassword(prevData => !prevData)}>
                            {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
                          </span>
                        </div>
                      ) : field.type === "date" ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            className="form-control date-picker"
                            format="DD/MM/YYYY"
                            id="joiningdate"
                            // value={formData.joiningDate}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            value={formData[field.name]}>
                            <option value="">{field.placeholder}</option>
                            {field.options.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
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
                          value={formData[field.name]}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <div className='create-form mt-4'>
            <h5 className='addmanager-heading'>Branch Information</h5>
            <Row className='add-fields'>
              {BranchInfo.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className='input-wrapper'>
                    <div className="form-group">
                      <label htmlFor={field.name}>{field.label}</label>
                      {field.options ? (
                        <div className="custom-select">
                          <select
                            id={field.name}
                            name={field.name}
                            className="form-control"
                            value={formData[field.name]}
                            onChange={handleInputChange}>
                            <option value="">{field.placeholder}</option>
                            {field.options.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
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
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

        </form>

        <div className='form-submit-button'>
          <button type='submit' className='cancel-button' onClick={handleCancel}>Cancel</button>
          <button type='submit' className='save-button' onClick={handlesubmit}>Save</button>
        </div>
      </section >

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
    </>
  );
};

export default CreateManager;