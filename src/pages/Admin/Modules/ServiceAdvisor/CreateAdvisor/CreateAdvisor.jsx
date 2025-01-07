import React, { useState } from 'react';
import "../CreateAdvisor/CreateAdvisor.css";
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown } from "react-icons/io";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CreateAdvisor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const AddAdvisor = [
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
      label: "Designation",
      name: "designation",
      placeholder: "Select designation",
      autocomplete: "designation",
      options: [
        "Service Manager",
        "Service Advisor"
      ],
    },
    {
      label: "Service Location",
      name: "servicelocation",
      placeholder: "Enter service location",
      type: "text",
      autocomplete: "servicelocation",
    },
    {
      label: "Joining Date",
      name: "joiningdate",
      placeholder: "Enter joining date",
      type: "date",
      autocomplete: "joiningdate",
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
      label: "Status",
      name: "status",
      placeholder: "Select status",
      autocomplete: "status",
      options: [
        "Active",
        "In Active"
      ],
    },
  ];

  return (
    <>
      <section className='create-advisor'>
        <h5 className='addadvisor-heading'>Add Service Advisor</h5>
        <form className='create-form'>
          <Row>
            {AddAdvisor.map((field, index) => (
              <Col key={index} xxl={4} xl={4} lg={4}>
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
                        />
                        <span className='input-icon' onClick={() => setShowPassword(prev => !prev)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
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
                        />
                        <span className='input-icon' onClick={() => setShowConfirmPassword(prev => !prev)}>
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </span>
                      </div>
                    ) : field.options ? (
                      <div className="custom-select">
                        <select
                          id={field.name}
                          name={field.name}
                          className="form-control"
                        >
                          <option value="" disabled>{field.placeholder}</option>
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
                        className="form-control"
                      />
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </form>

        <div className='form-submit-button'>
          <button type='submit' className='cancel-button'>Cancel</button>
          <button type='submit' className='save-button'>Save</button>
        </div>
      </section>
    </>
  )
}

export default CreateAdvisor;