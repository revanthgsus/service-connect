import React, { useState } from 'react';
import "../CreateCustomer/CreateCustomer.css";
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown } from "react-icons/io";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const CreateCustomer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const AddCustomers = [
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
  ]

  const handlesubmit = (e) => {
    e.preventDefault();
    navigate("/admin/service-manager")
  }
  return (
    <>
      <section className='create-customer'>
        <h5 className='addcustomer-heading'>Add Customer</h5>
        <form className='create-form'>
          <Row>
            {AddCustomers.map((field, index) => (
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
          <button type='submit' className='cancel-button' onClick={handlesubmit}>Cancel</button>
          <button type='submit' className='save-button' onClick={handlesubmit}>Save</button>
        </div>
      </section>
    </>
  )
}

export default CreateCustomer;