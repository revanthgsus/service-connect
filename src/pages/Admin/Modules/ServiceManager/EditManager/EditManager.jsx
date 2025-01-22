import React, { useState } from 'react';
import "./EditManager.css"
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown } from "react-icons/io";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import CancelModal from '../../../Common/CancelModal/CancelModal';

const EditManager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { managerData } = location.state || {};

  const [cancelShow, setCancelShow] = useState(false);

  const [formData, setFormData] = useState({
    username: managerData?.managerName || '',
    emailaddress: managerData?.mailID || '',
    mobilenumber: managerData?.mobileNumber || '',
    password: '',
    confirmpassword: '',
    joiningdate: '',
    designation: 'Service Manager',
    branchname: managerData?.location || '',
    branchlocation: managerData?.location || '',
    Department: '',
    status: managerData?.status || '',
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevstate) => ({
      ...prevstate,
      [name]: value,
    }))
  }
  const ManagerInfo = [
    {
      label: "User Name",
      name: "username",
      placeholder: "Enter username",
      type: "text",
      autocomplete: "username",
    },
    {
      label: "Email Address",
      name: "emailaddress",
      placeholder: "Enter email address",
      type: "email",
      autocomplete: "emailaddress",
    },
    {
      label: "Mobile Number",
      name: "mobilenumber",
      placeholder: "Enter mobile number",
      type: "number",
      autocomplete: "mobilenumber",
    },
    {
      label: "Password",
      name: "password",
      placeholder: "Enter password",
      type: "password",
      autocomplete: "password",
    },
    {
      label: "Confirm Password",
      name: "confirmpassword",
      placeholder: "Enter Confirm Password",
      type: "password",
      autocomplete: "confirmpassword",
    },
    {
      label: "Joining Date",
      name: "joiningdate",
      placeholder: "Enter joining date",
      type: "date",
      autocomplete: "joiningdate",
    },
  ];

  const BranchInfo = [
    {
      label: "Designation",
      name: "designation",
      placeholder: "Select designation",
      autocomplete: "designation",
      type: "text",
      value: "Service Manager",
    },
    {
      label: "Branch Name",
      name: "branchname",
      placeholder: "Enter branch name",
      type: "text",
      autocomplete: "branchname",
    },
    {
      label: "Branch Location",
      name: "branchlocation",
      placeholder: "Enter Branch location",
      type: "text",
      autocomplete: "branchlocation",
    },
    {
      label: "Department",
      name: "Department",
      placeholder: "Enter Department",
      type: "text",
      autocomplete: "Department",
    },
    {
      label: "Status",
      name: "status",
      placeholder: "Select status",
      autocomplete: "status",
      options: [
        "Active",
        "In Active"
      ],
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', formData)
    navigate("/admin/service-manager")
  }

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
      <section className='edit-manager'>
        <div className='edit-header'>
          <IoMdArrowRoundBack onClick={handleBack} />
          <h5>Edit Service Manager</h5>
        </div>

        <form>
          <div className='edit-form'>
            <h5 className='editmanager-heading'>Manager Information</h5>

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
                            autoComplete={field.autocomplete}
                            className="form-control"
                            value={formData[field.name]}
                            onChange={handleChange}
                          />
                          <span className='input-icon' onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                          </span>
                        </div>
                      ) : field.name === "confirmpassword" ? (
                        <div className="password-field">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            autoComplete={field.autocomplete}
                            className="form-control"
                            onChange={handleChange}

                          />
                          <span className='input-icon' onClick={() => setShowConfirmPassword(prev => !prev)}>
                            {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
                          </span>
                        </div>
                      ) : field.options ? (
                        <div className="custom-select">
                          <select
                            id={field.name}
                            name={field.name}
                            className="form-control"
                            value={formData[field.name]}
                            onChange={handleChange}
                          >
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
                          autoComplete={field.autocomplete}
                          className="form-control"
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>


          <div className='edit-form mt-4'>
            <h5 className='editmanager-heading'>Branch Information</h5>
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
                            onChange={handleChange}
                          >
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
                          autoComplete={field.autocomplete}
                          value={formData[field.name]}
                          className="form-control"
                          onChange={handleChange}
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
          <button type='submit' className='save-button' onClick={handleSubmit}>Save</button>
        </div>
      </section>

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
    </>
  )
}

export default EditManager;