import React, { useEffect, useState } from 'react';
import './ViewAppointment.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useAuth } from '../../../../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import SelectedProvider from '../SelectedProvider/SelectedProvider';
import RejectModal from '../../../../../common/RejectModal/RejectModal';

const ViewAppointment = ({ selectedAdvisor }) => {
  const { setShowTokenModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentData } = location.state || {};
  const [showRejectModal, setShowRejectModal] = useState(false);
  const userRole = sessionStorage.getItem('userRole');

  const [loading, setLoading] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  useEffect(() => {
    if (appointmentData?.status === "Rejected") {
      setShowRejectModal(true);
    }
  }, [appointmentData]);

  const appointmentDetails = [
    { label: 'Company Name', value: appointmentData?.companyName || '-' },
    { label: 'Preferred Location', value: appointmentData?.preferredLocation || '-' },
    { label: 'Appointment Date', value: appointmentData?.appointmentDate || '-' },
    { label: 'Start Time', value: appointmentData?.startTime || '-' },
    { label: 'Product Name', value: appointmentData?.productName || '-' },
    { label: 'Product Serial Number', value: appointmentData?.productSerialNo || '-' },
    { label: 'Priority Level', value: appointmentData?.priorityLevel || '-' },
  ];

  if (userRole === 'Manager') {
    appointmentDetails.unshift({
      label: 'Customer ID', value: appointmentData?.customerId || '-',
    });
  };

  const complaintData = [
    { label: 'Complaint Description', value: appointmentData?.complaintDescription || 'No complaints here' },
  ]

  const advisorId = appointmentData?.advisorId;
  const customerName = appointmentData?.customerName;
  const appointmentId = appointmentData?.appointmentId;

  const handleRemind = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/remindAdvisor/${advisorId}/${customerName}/${appointmentId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Reminder sent to advisor.");
        setReminderSent(true);
      } else {
        toast.error(response?.data?.message || "Failed to send reminder to the advisor.")
      }
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  const handleProgressClick = async () => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const appointmentId = appointmentData.appointmentId;

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewAppointmentById/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.status === 200 && response?.data?.status === "success") {
        navigate("/manager/list/viewprogress", { state: { activityData: response.data } });
      } else {
        toast.error("Unable to retrieve quotes data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1)
  };

  return (
    <>
      {loading && <PreLoader />}
      {!loading && (
        <section className='appointment-summary'>
          <div className='appointment-header'>
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>View Appointment</h5>
            </div>

            {userRole === 'Manager' && appointmentData?.status === 'Scheduled' && (
              <button type="button" className="remind-btn" onClick={handleRemind}
                disabled={loading || reminderSent}>
                {reminderSent ? "Reminder Sent" : "Remind Advisor"}
              </button>
            )}

            {userRole === 'Manager' &&
              ['Yet to start', 'In Progress', 'Completed'].includes(appointmentData?.serviceStatus) && (
                <button type="button" className="remind-btn" onClick={handleProgressClick}
                  disabled={loading}>View Progress
                </button>
              )}
          </div>

          {/* appointment Data */}
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

          <SelectedProvider selectedAdvisor={selectedAdvisor} />

          {/* quotes table data */}
          <div className="complaint-details mt-4">
            <h5 className="app-heading">Complaint Description</h5>
            {complaintData.map((details, index) => (
              <div key={index} className='complaint-item'>
                <p>{details.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <RejectModal
        showRejectModal={showRejectModal}
        handleCloseReject={() => setShowRejectModal(false)}
        rejectionReason={appointmentData?.rejectionReason}
      />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        theme="light"
        hideProgressBar={true}
      />
    </>
  )
}

export default ViewAppointment;
