import React, { useEffect, useState } from 'react';
import './ManageAppointment.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { Col, Row } from 'react-bootstrap';
import RejectModal from '../../../../../common/RejectModal/RejectModal';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const ManageAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowTokenModal } = useAuth();
  const { appointmentData } = location.state || {};
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const appointmentDetails = [
    { label: 'Customer Name', value: appointmentData?.customerName || '-' },
    { label: 'Email Address', value: appointmentData?.emailAddress || '-' },
    { label: 'Mobile Number', value: appointmentData?.mobileNumber || '-' },
    { label: 'Service Type', value: appointmentData?.serviceType || '-' },
    { label: 'Preferred Location', value: appointmentData?.preferredLocation || '-' },
    { label: 'Appointment Date', value: appointmentData?.appointmentDate || '-' },
    { label: 'Start Time', value: appointmentData?.startTime || '-' },
    { label: 'Product Name', value: appointmentData?.productName || '-' },
    { label: 'Product Serial Number', value: appointmentData?.productSerialNo || '-' },
    { label: 'Priority Level', value: appointmentData?.priorityLevel || '-' },
  ];

  const complaintData = [
    { value: appointmentData?.complaintDescription || 'No complaints here' },
  ];

  useEffect(() => {
    if (appointmentData?.status === "Rejected") {
      setShowRejectModal(true);
    }
  }, [appointmentData]);

  // For transfer this data for accept and send quote api call
  const handleAccept = (e) => {
    e.preventDefault();
    navigate('/advisor/appointments/quote',
      {
        state: {
          customerId: appointmentData?.customerId,
          appointmentId: appointmentData?.appointmentId,
          productName: appointmentData?.productName,
          productSerialNo: appointmentData?.productSerialNo
        }
      })
  };

  const handleReject = () => setShowRejectModal(true);

  const handleRejectSubmit = async (reason) => {
    if (!appointmentData?.appointmentId) return;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      // First, update the appointment status to "Rejected"
      const statusResponse = await axios.put(`${API_BASE_URL}/advisorMaster/updateAppointmentStatus/${appointmentData?.appointmentId}/Rejected`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (statusResponse?.data?.status !== "success") {
        toast.error("Failed to reject appointment. Try again.");
      }

      const payload = {
        appointmentId: appointmentData?.appointmentId,
        rejectionReason: reason,
      };

      const reasonResponse = await axios.put(`${API_BASE_URL}/advisorMaster/addReasonForRejection`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (reasonResponse?.data?.status === "success") {
        toast.success("Reject reason sent successfully.");
        setTimeout(() => {
          navigate('/advisor/appointments');
        }, 1000);
      } else {
        toast.error("Failed to reject appointment. Try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleBack = () => { navigate(-1) };
  const handleHistory = () => { navigate('/advisor/appointments/history') };

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className='appointment-summary'>
          <div className='appointment-header'>
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Manage Your Appointments</h5>
            </div>
            <button type="button"
              className="history-button" onClick={handleHistory}>Service History</button>
          </div>

          <div className="appointment-data">
            <h5 className="app-heading">Appointment Details</h5>
            <Row className='view-fields'>
              {appointmentDetails.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className='input-wrapper'>
                    <div className='input-field'>
                      <h6>{field.label}</h6>
                      <p>{field.value}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <div className="complaint-details mt-4">
            <h5 className="app-heading">Complaint Description</h5>
            {complaintData.map((details, index) => (
              <div key={index} className='complaint-item'>
                <p>{details.value}</p>
              </div>
            ))}
          </div>

          {appointmentData?.status === "Scheduled" && (
            <div className='accept-button-container'>
              <button type='submit'
                className='decline-button'
                onClick={handleReject}>
                <MdOutlineCancel />Reject</button>
              <button type='submit'
                className='accept-button'
                onClick={handleAccept}>
                <BsFillHandThumbsUpFill />Accept</button>
            </div>
          )}
        </section>
      )}

      <RejectModal
        showRejectModal={showRejectModal}
        handleCloseReject={() => setShowRejectModal(false)}
        onSubmitReject={handleRejectSubmit}
        rejectionReason={appointmentData?.rejectionReason}
      />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  )
}

export default ManageAppointment