import React, { useState } from 'react';
import './RequestAppointment.css';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ReactComponent as Locationicon } from "../../../../../assets/images/customer/appointment/location-icon.svg";
import ProviderList from '../ProviderListShow/ProviderList';
import SelectedProvider from '../SelectedProvider/SelectedProvider';
import ComplaintDetails from '../ComplaintDetails/ComplaintDetails';
import PreferenceDetails from '../PreferenceDetails/PreferenceDetails';
import CancelModal from '../../../../../common/CancelModal/CancelModal';

const RequestAppointment = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState(null);
  const [providerShow, setProviderShow] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [cancelShow, setCancelShow] = useState(false);

  const ServiceTypes = [
    'Oil Change',
    'Tire Rotation',
    'Brake Inspection',
    'Battery Check',
    'Engine Diagnostics',
    'Engine Diagnostics',
  ];

  const LocationData = [
    {
      label: 'Preferred Location',
      name: 'location',
      placeholder: 'Enter preferred location',
      type: 'text',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(-1)
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setCancelShow(true)
  };

  const handleCancelClose = (e) => {
    e.preventDefault()
    setCancelShow(false)
  };

  const handleBack = () => {
    setCancelShow(true)
  };

  const handleView = (e) => {
    e.preventDefault()
    setProviderShow(true)
  };

  const handleCloseProvider = () => {
    setProviderShow(false);
  };

  const handleSelectAdvisor = (advisor) => {
    setSelectedAdvisor(advisor);
  };

  return (
    <>
      <section className="schedule-appointment">
        <div className="header">
          <IoMdArrowRoundBack onClick={handleBack} />
          <h5>Schedule Appointment</h5>
        </div>

        <form >
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
                              color: "var(--text- color)",
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiInputBase-input": {
                              color: "var(--text-color) !important",
                            },
                            "& .MuiAutocomplete-endAdornment": {
                              position: "absolute",
                              right: "0px !important",
                              color: "var(--placeholder-color)",
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: "var(--placeholder-color)",
                              opacity: 1,
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
                      componentsProps={{
                        clearIndicator: {
                          sx: {
                            display: serviceType ? "flex" : "none",
                            color: "var(--icon-color)",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </Col>

              {LocationData.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className="input-wrapper">
                    <div className="form-group location-input">
                      <label htmlFor={field.name}>{field.label}</label>
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

              <Col className='provider-container'>
                <button type="submit" className="provider-btn" onClick={handleView}>View Provider</button>
              </Col>
            </Row>
          </div>

          <SelectedProvider selectedAdvisor={selectedAdvisor} />
          <PreferenceDetails selectedAdvisor={selectedAdvisor} />
          <ComplaintDetails selectedAdvisor={selectedAdvisor} />
        </form>

        <ProviderList show={providerShow} handleClose={handleCloseProvider} onSelectAdvisor={handleSelectAdvisor} />

        {selectedAdvisor && (
          <div className="form-submit-button">
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="request-button" onClick={handleSubmit}>Request Appointment</button>
          </div>
        )}
      </section>
      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
    </>
  );
};

export default RequestAppointment;
