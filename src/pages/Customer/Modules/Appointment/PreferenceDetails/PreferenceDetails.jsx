import React, { useEffect, useState } from 'react';
import './PreferenceDetails.css';
import { Col, Row } from 'react-bootstrap';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { InputAdornment, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Formik, Form, ErrorMessage } from 'formik';
import { AppointmentValidationSchema } from '../../../../../utils/CustomerValidation';

const PreferenceDetails = ({ selectedAdvisor, onUpdate }) => {
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [productName, setProductName] = useState('');
  const [productSerialNo, setProductSerialNo] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('');

  useEffect(() => {
    if (selectedAdvisor) {
      onUpdate({
        appointmentDate: appointmentDate ? dayjs(appointmentDate).format('DD/MM/YYYY') : '',
        startTime: startTime ? dayjs(startTime).format('hh:mm:A') : "",
        productName,
        productSerialNo,
        serviceType,
        priorityLevel,
      });
    }
  }, [appointmentDate, startTime, productName, productSerialNo, serviceType, priorityLevel, selectedAdvisor, onUpdate]);


  const PriorityOptions = ['Urgent', 'Medium', 'Low'];

  return (
    <>
      {selectedAdvisor && (
        <div className="preference-form mt-4">
          <h5>Select Your Preference</h5>

          <Formik
            initialValues={{
              appointmentDate: null,
              startTime: null,
              productName: '',
              productSerialNo: '',
              serviceType: '',
              priorityLevel: '',
            }}
            validationSchema={AppointmentValidationSchema}
            onSubmit={(values) => {
              onUpdate(values);
            }}>
            {({ values, setFieldValue }) => (
              <Form>
                <Row className="appointment-field">
                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor='appointmentDate'>Appointment Date</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            value={values.appointmentDate}
                            onChange={(date) => {
                              setAppointmentDate(date); // Update local state
                              setFieldValue('appointmentDate', date); // Update Formik state
                            }}
                            className="form-control date-picker"
                            format="DD/MM/YYYY"
                            minDate={dayjs()}
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
                        <ErrorMessage name="appointmentDate" component="div" className="text-danger" />
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor='startTime'>Start Time</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            value={values.startTime}
                            onChange={(time) => {
                              setStartTime(time);
                              setFieldValue('startTime', time);
                            }}
                            slotProps={{
                              textField: {
                                className: "form-control time-picker",
                                variant: "outlined",
                                fullWidth: true,
                                InputProps: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton>
                                        <AccessTimeIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }
                              }
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                outline: "0",
                                fontSize: "11px",
                                paddingRight: "0px",
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
                        <ErrorMessage name="startTime" component="div" className="text-danger" />
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor='productName'>Product Name</label>
                        <input
                          id='ProductName'
                          type='text'
                          name='productName'
                          placeholder='Enter product name'
                          className="form-control"
                          onChange={(e) => setProductName(e.target.value)} />
                        <ErrorMessage name="productName" component="div" className="text-danger" />
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor="productSerialNo">Product Serial Number</label>
                        <input
                          id="productSerialNo"
                          type="text"
                          name="productSerialNo"
                          placeholder="Enter serial number"
                          className="form-control"
                          value={productSerialNo}
                          onChange={(e) => setProductSerialNo(e.target.value)}
                        />
                        <ErrorMessage name="productSerialNo" component="div" className="text-danger" />
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor="serviceType">Service Type</label>
                        <input
                          id="serviceType"
                          type="text"
                          name="serviceType"
                          placeholder="Enter service type"
                          className="form-control"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                        />
                        <ErrorMessage name="serviceType" component="div" className="text-danger" />
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="priority-options input-wrapper">
                      <div className='form-group'>
                        <label>Priority Level</label>
                        <div className="radio-group">
                          {PriorityOptions.map((option, index) => (
                            <div key={index} className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                id={`priority-${option}`}
                                name="priorityLevel"
                                value={option}
                                checked={priorityLevel === option}
                                onChange={(e) => setPriorityLevel(e.target.value)} />
                              <label
                                className="form-check-label"
                                htmlFor={`priority-${option}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                        <ErrorMessage name="priorityLevel" component="div" className="text-danger" />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>

        </div >
      )}
    </>
  )
}

export default PreferenceDetails;