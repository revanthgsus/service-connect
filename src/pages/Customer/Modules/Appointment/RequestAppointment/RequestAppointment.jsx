import React, { useCallback, useEffect, useState } from 'react';
import './RequestAppointment.css';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { GrLocation } from "react-icons/gr";
import ProviderList from '../ProviderListShow/ProviderList';
import SelectedProvider from '../SelectedProvider/SelectedProvider';
import ComplaintDetails from '../ComplaintDetails/ComplaintDetails';
import PreferenceDetails from '../PreferenceDetails/PreferenceDetails';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { useAuth } from '../../../../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { AppointmentValidationSchema } from '../../../../../utils/CustomerValidation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const RequestAppointment = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();

  const [providerShow, setProviderShow] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferenceDetails, setPreferenceDetails] = useState({});
  const [complaintDetails, setComplaintDetails] = useState({});
  const [advisorList, setAdvisorList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [totalHistory, setTotalHistory] = useState(0);

  const customerId = sessionStorage.getItem("userId");
  const customerName = sessionStorage.getItem("userName");

  const initialValues = {
    companyName: sessionStorage.getItem("companyName") || '',
    companyAddress: '',
    appointmentDate: null,
    startTime: null,
    productName: '',
    productSerialNo: '',
    serviceType: '',
    priorityLevel: '',
    complaintDescription: '',
  };

  // fetch location in dropdown
  const fetchSuggestions = async (companyName) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewBranches/${companyName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response?.data?.status === 'success') {
        setSuggestions(response?.data?.branches || []);
      } else {
        toast.error("Failed to fetch location. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again");
    }
  };

  // request appointment api call
  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const appointmentData = {
      customerId,
      customerName,
      companyName: values.companyName,
      preferredLocation: values.companyAddress,
      advisorId: selectedAdvisor?.advisorId,
      advisorLocation: selectedAdvisor?.companyAddress,
      advisorName: selectedAdvisor?.userName,
      appointmentDate: preferenceDetails.appointmentDate,
      productName: preferenceDetails.productName,
      productSerialNo: preferenceDetails.productSerialNo,
      serviceType: preferenceDetails.serviceType,
      startTime: preferenceDetails.startTime,
      priorityLevel: preferenceDetails.priorityLevel,
      complaintDescription: complaintDetails.complaintDescription,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/scheduleAppointment`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Appointment Request added successfully.");
        setTimeout(() => { navigate(-1) }, 500);
      } else {
        toast.error(response?.data?.error || "Failed to request appointment.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      // setSubmitting(false);
      setLoading(false);
    }
  }, [setShowTokenModal, selectedAdvisor, preferenceDetails, complaintDetails, customerId, customerName, navigate]);


  const handleView = async (companyName, companyAddress, setFieldTouched, setFieldError) => {
    setFieldTouched('companyName', true);
    setFieldTouched('companyAddress', true);

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const errors = {};
    if (!companyName || companyName.trim() === '') {
      errors.companyName = "Company name is required.";
    }
    if (!companyAddress || companyAddress.trim() === '') {
      errors.companyAddress = "Preferred location is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldError('companyName', errors.companyName);
      setFieldError('companyAddress', errors.companyAddress);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/advisorMaster/viewProvider/${companyName}/${companyAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response?.status === 200) {
        setProviderShow(true)
        setAdvisorList(response?.data || []);
      } else {
        toast.error("Failed to fetch providers. Please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => { setCancelShow(true) };
  const handleCancelClose = () => { setCancelShow(false) };
  const handleBack = () => { setCancelShow(true) };

  const fetchHistory = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    const userId = sessionStorage.getItem("userId");

    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      pageNo: 1,
      noOfDatas: 10,
      customerId: userId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/getCustomerInvoicesListPage`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setTotalHistory(response?.data?.count || 0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    }
  }, [setShowTokenModal]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleHistory = (e) => {
    e.preventDefault()
    navigate("/customer/appointments/history")
  };

  const handleCloseProvider = () => { setProviderShow(false) };
  const handleSelectAdvisor = (advisor) => {
    setSelectedAdvisor(advisor);
  };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="schedule-appointment">
          <div className="top-alignment">
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Schedule Appointment</h5>
            </div>

            {totalHistory > 0 && (
              <button type="button" className="history-button" onClick={handleHistory}>
                Service History
              </button>
            )}
          </div>

          <Formik
            initialValues={initialValues}
            // validationSchema={AppointmentValidationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, setFieldValue, setFieldTouched, setFieldError, isSubmitting }) => (
              <>
                <Form>
                  <div className="request-form">
                    <h5 className="preference-heading">Select Your Preferences</h5>
                    <Row className="add-fields">
                      <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                        <div className="input-wrapper">
                          <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <Field
                              id='companyName'
                              type='text'
                              name='companyName'
                              value={values.companyName}
                              readOnly
                              placeholder='Enter company name'
                              className="form-control" />
                            <ErrorMessage name="companyName" component="div" className="error-message" />
                          </div>
                        </div>
                      </Col>

                      <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                        <div className="input-wrapper">
                          <div className="form-group">
                            <label htmlFor='companyAddress'>Preferred Location</label>
                            <div>
                              <Autocomplete
                                freeSolo
                                options={suggestions}
                                inputValue={values.companyAddress}
                                disableClearable
                                onInputChange={(e, newValue) => {
                                  setFieldValue("companyAddress", newValue);
                                }}
                                onFocus={() => {
                                  fetchSuggestions(initialValues.companyName);
                                }}
                                renderOption={(props, option) => (
                                  <li {...props} style={{ fontSize: '14px' }}>
                                    {option}
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Enter preferred location"
                                    className="form-control"
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
                                        padding: "2px !important",
                                        border: "none",
                                        outline: "none",
                                        fontFamily: "var(--font-family)"
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
                              />
                              <span className='location-icon'><GrLocation /></span>
                            </div>
                            <ErrorMessage name="companyAddress" component="div" className="error-message" />
                          </div>
                        </div>
                      </Col>

                      <Col className='provider-container'>
                        <button type="button"
                          className="provider-btn"
                          onClick={() => handleView(values.companyName, values.companyAddress, setFieldTouched, setFieldError)}
                          disabled={!values.companyName.trim() || !values.companyAddress.trim()}>
                          View Provider
                        </button>
                      </Col>
                    </Row>
                  </div>

                  <SelectedProvider
                    selectedAdvisor={selectedAdvisor} />
                  <PreferenceDetails
                    selectedAdvisor={selectedAdvisor}
                    onUpdate={setPreferenceDetails} />
                  <ComplaintDetails
                    selectedAdvisor={selectedAdvisor}
                    onUpdate={setComplaintDetails} />

                  {/* request button display */}
                  {selectedAdvisor && (
                    <div className="form-submit-button">
                      <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                      <button type="submit" className="request-button" disabled={isSubmitting}>
                        <span className="mobile-button">
                          {isSubmitting ? 'Submitting...' : 'Request'}
                        </span>
                        <span className="desktop-button">
                          {isSubmitting ? 'Submitting...' : 'Request Appointment'}</span>
                      </button>
                    </div>
                  )}
                </Form>
              </>
            )}
          </Formik>

        </section >
      )}

      <ProviderList
        show={providerShow}
        handleClose={handleCloseProvider}
        onSelectAdvisor={handleSelectAdvisor}
        advisors={advisorList} />

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default RequestAppointment;
