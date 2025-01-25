import React, { useEffect, useState } from 'react';
import './RequestAppointment.css';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ReactComponent as Locationicon } from "../../../../../assets/images/customer/appointment/location-icon.svg"
import ProviderList from './../ProviderList/ProviderList';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';

const RequestAppointment = () => {
  const navigate = useNavigate();

  const [serviceType, setServiceType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [providerShow, setProviderShow] = useState(true);

  useEffect(() => {
    setProviderShow(false);
  }, [])

  const ServiceTypes = [
    'Oil Change',
    'Tire Rotation',
    'Brake Inspection',
    'Battery Check',
    'Engine Diagnostics',
    'Engine Diagnostics',
  ];

  const AppointmentDate = [
    {
      label: 'Appointment Date',
      name: 'appointmentdate',
      placeholder: 'Enter date',
      type: 'date',
    }
  ];

  const AppointmentTime = [
    {
      label: 'Start Time',
      name: 'starttime',
      placeholder: 'Enter time',
      type: 'time',
    },
  ];

  const LocationData = [
    {
      label: 'Preferred Location',
      name: 'location',
      placeholder: 'Enter preferred location',
      type: 'text',
    },
  ];

  const ProductData = [
    {
      label: 'Product Name',
      name: 'productname',
      placeholder: 'Enter product name',
      type: 'text',
    },
    {
      label: 'Product Serial Number',
      name: 'serialnumber',
      placeholder: 'Enter serial number',
      type: 'text',
    },
  ];

  const UrgencyOptions = ['Standard', 'Urgent', 'Scheduled'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setProviderShow(true)
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <>
      <section className="schedule-appointment">
        <div className="header">
          <IoMdArrowRoundBack onClick={handleBack} />
          <h5>Schedule Appointment</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="request-form">
            <h5 className="preference-heading">Select Your Preferences</h5>
            <Row className="add-fields">
              <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                <div className="input-wrapper">
                  <div className="form-group service-input">
                    <label htmlFor="servicetype">Service Type</label>
                    <Autocomplete
                      id="serviceType"
                      options={ServiceTypes}
                      value={serviceType}
                      onChange={(event, newValue) => setServiceType(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Enter service type"
                          className="form-control suggestion"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontSize: "14px",
                              padding: "0px",
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiAutocomplete-endAdornment": {
                              position: "absolute",
                              right: "0px !important",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                          }}
                        />
                      )}
                    />

                  </div>
                </div>
              </Col>

              {AppointmentDate.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className="input-wrapper">
                    <div className="form-group">
                      <label htmlFor={field.name}>{field.label}</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          className="form-control date-picker"
                          format="DD/MM/YYYY"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              outline: "0",
                              fontSize: "10px",
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
                    </div>
                  </div>
                </Col>
              ))}


              {AppointmentTime.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className="input-wrapper">
                    <div className="form-group">
                      <label htmlFor={field.name}>{field.label}</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={['TimePicker', 'MobileTimePicker', 'DesktopTimePicker']}
                          className="time-picker"
                          sx={{
                            "& .MuiStack-root": {
                              paddingTop: "0px !important",
                              outline: "none"
                            },
                            "& .MuiOutlinedInput-root": {
                              outline: "none",
                              "& fieldset": {
                                border: "1px solid transparent",
                              },
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "8px 15px",
                              border: "1px solid transparent"
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                          }}
                        >
                          <DemoItem>
                            <MobileTimePicker defaultValue={dayjs('2025-10-20T12:00')} />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </div>
                </Col>
              ))}


              {LocationData.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className="input-wrapper">
                    <label htmlFor={field.name}>{field.label}</label>
                    <div className="form-group location-input">
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="form-control"
                      />
                      <span className='input-icon'>
                        <Locationicon />
                      </span>
                    </div>
                  </div>
                </Col>
              ))}

              {ProductData.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className="input-wrapper">
                    <div className="form-group">
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="form-control"
                      />
                    </div>
                  </div>
                </Col>
              ))}

              <Col xxl={8} xl={8} lg={8} md={8} sm={7}>
                <div className="urgency-options input-wrapper">
                  <label>Urgency Level</label>
                  <div className="radio-group">
                    {UrgencyOptions.map((option, index) => (
                      <div key={index} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`urgency-${option}`}
                          name="urgencyLevel"
                          value={option}
                          checked={urgencyLevel === option}
                          onChange={(e) => setUrgencyLevel(e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`urgency-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col className='provider-container'>
                <div >
                  <button type="submit" className="provider-btn">View Provider</button>
                </div>
              </Col>
            </Row>
          </div>
        </form>

        {providerShow && <ProviderList />}

        <div className="form-submit-button">
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="request-button">Request Appointment</button>
        </div>
      </section>
    </>
  );
};

export default RequestAppointment;
