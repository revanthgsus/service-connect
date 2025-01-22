import React, { useState } from 'react';
import "../CreateAdvisor/CreateAdvisor.css";
import { Col, Row } from 'react-bootstrap';
import { IoIosArrowDown } from "react-icons/io";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import CancelModal from '../../../Common/CancelModal/CancelModal';

const CreateAdvsior = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [cancelShow, setCancelShow] = useState(false);

  const AdvisorInfo = [
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
      value: "Service Advisor",
    },
    {
      label: "Branch Name",
      name: "branchname",
      placeholder: "Enter branch name",
      type: "text",
      autocomplete: "branchname",
    },
    {
      label: "Branch Address",
      name: "branchaddress",
      placeholder: "Enter Branch Address",
      type: "text",
      autocomplete: "branchaddress",
    },
    {
      label: "Pincode",
      name: "pincode",
      placeholder: "Enter Pincode",
      type: "text",
      autocomplete: "pincode",
    },
    {
      label: "Department",
      name: "Department",
      placeholder: "Enter Department",
      type: "text",
      autocomplete: "Department",
    },
    {
      label: "Service Type",
      name: "servicetype",
      placeholder: "Enter Service Type",
      type: "text",
      autocomplete: "servicetype",
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

  const handlesubmit = (e) => {
    e.preventDefault();
    navigate("/admin/service-advisor")
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
      <section className='create-advisor'>
        <div className='create-header'>
          <IoMdArrowRoundBack onClick={handleBack} />
          <h5>Create Service Advisor</h5>
        </div>
        <form>
          <div className='create-form'>
            <h5 className='createadvisor-heading'>Advisor Information</h5>
            <Row className='add-fields'>
              {AdvisorInfo.map((field, index) => (
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
          </div>

          <div className='create-form mt-4'>
            <h5 className='createadvisor-heading'>Branch Information</h5>
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
                          // value={field.value || ""}
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
      </section>

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
    </>
  );
};

export default CreateAdvsior;