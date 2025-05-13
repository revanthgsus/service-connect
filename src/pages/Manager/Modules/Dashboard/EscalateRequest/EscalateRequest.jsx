import React, { useCallback, useEffect, useState } from 'react';
import './EscalateRequest.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import UPLOAD_FILE_API from '../../../../../services/UploadFile';
import { BiSolidUserCircle } from "react-icons/bi";
import Skeleton from '@mui/material/Skeleton';

const EscalateRequest = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  const fetchRequests = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      companyName,
      companyLocation,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/getEscalateServiceListPage`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setRequestData(response?.data?.escalateServiceListPage || []);
      } else {
        toast.error("Failed to fetch Escalate data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setLoading(false);
    }
  }, [setShowTokenModal, companyName, companyLocation]);


  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);


  const getImageUrl = (imageId) => {
    if (!imageId) return;
    return `${UPLOAD_FILE_API}/v1/view/${imageId}`;
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);


  const handleRequestClick = async (appointment) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewAppointmentById/${appointment.appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200 && response?.data?.status === "success") {
        navigate("/manager/dashboard/viewescalate",
          { state: { appointmentData: response?.data?.data } });
      } else {
        toast.error("Unable to retrieve appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = (e) => {
    e.preventDefault();
    navigate('escalate')
  };

  return (
    <>
      <section className='escalate-request'>
        <div className='request-header-container'>
          <div className='request-header'>
            <h6>Escalate Requests</h6>
            <button type='button'
              className='view-btn'
              onClick={handleViewAllClick}>View All</button>
          </div>
          <hr className='mt-2 horizontal-line mb-2' />
        </div>

        <div className='request-list'>
          {loading ? (
            [...Array(requestData.length || 7)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width="100%" height={70} className="mb-2" />
            ))
          ) : requestData.length > 0 ? (
            requestData.map((data) => (
              <div key={data.id} className="request-item"
                onClick={() => handleRequestClick(data.appointment)}>
                {data.imageId && !imageError ? (
                  <div className="image-wrapper">
                    {!imageLoaded && (
                      <Skeleton variant="circular" width={40} height={40} />
                    )}
                    <img
                      src={getImageUrl(data.imageId)}
                      alt="profile"
                      className="customer-img"
                      style={{ display: imageLoaded ? "block" : "none" }}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                ) : (
                  <BiSolidUserCircle className="customer-img" />
                )}

                <div className="request-details">
                  <h6>{data.appointment.customerId}</h6>
                  <span>{data.appointment.customerName}</span>
                </div>
                <span className={`priority-level ${data.appointment.priorityLevel.toLowerCase()}`}>
                  {data.appointment.priorityLevel}
                </span>
              </div>
            ))
          ) : (
            <p className='no-records'>No escalate requests found.</p>
          )}
        </div>
      </section>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default EscalateRequest;
