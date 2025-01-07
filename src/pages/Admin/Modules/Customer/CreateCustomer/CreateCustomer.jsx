import React, { useState } from 'react';
import "../CreateCustomer/CreateCustomer.css";
import { Col, Row } from 'react-bootstrap';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CreateCustomer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const AddCustomers = [
    { label: "User Name", name: "username", placeholder: "Enter username",type: "text", autocomplete: "username",},
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
  return (
    <>
      <section className='create-customer'>
        <h5 className='addcustomer-heading'>Add Customer</h5>
        <form className='create-form'>
          <Row>
            {AddCustomers.map((field, index) => (
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

export default CreateCustomer;