import React, { useState } from 'react';
import "./ComplaintDetails.css";
import { Col, Row } from 'react-bootstrap';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';

const ComplaintDetails = ({ selectedAdvisor }) => {
  const [urgencyLevel, setUrgencyLevel] = useState('');

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

  return (
    <>
      {selectedAdvisor && (
        <div className="complaint-form">
          <Row className="appointment-field">
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
                        }}>
                        <DemoItem>
                          <MobileTimePicker defaultValue={dayjs('2025-10-20T12:00')} />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
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
                      className="form-control" />
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
                        onChange={(e) => setUrgencyLevel(e.target.value)} />
                      <label
                        className="form-check-label"
                        htmlFor={`urgency-${option}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default ComplaintDetails;