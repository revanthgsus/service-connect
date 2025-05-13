import React, { useCallback, useEffect, useState } from 'react';
import './RecentRequest.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import UPLOAD_FILE_API from '../../../../../services/UploadFile';
import { BiSolidUserCircle } from "react-icons/bi";
import Skeleton from '@mui/material/Skeleton';

const RecentRequest = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const advisorId = sessionStorage.getItem("userId");

  const fetchRequests = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/advisorMaster/getRecentRequests/${advisorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setRequestData(response?.data?.data || []);
      } else {
        toast.error("Failed to fetch request data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setLoading(false);
    }
  }, [setShowTokenModal, advisorId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getImageUrl = (imageId) => {
    if (!imageId) return;
    return `${UPLOAD_FILE_API}/v1/view/${imageId}`;
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleRequest = (e) => {
    e.preventDefault();
    navigate('/advisor/appointments');
  }

  return (
    <>
      <section className='recent-request'>
        <div className='request-header'>
          <h6>Recent Requests</h6>
          <hr className='mt-1 horizontal-line mb-2' />
        </div>

        <div className='request-list'>
          {loading ? (
            [...Array(requestData.length || 7)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width="100%" height={70} className="mb-2" />
            ))
          ) : requestData.length > 0 ? (
            requestData.map((data) => (
              <div key={data.id} className="request-item" onClick={handleRequest}>
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
                  <h6>{data.customerId}</h6>
                  <span>{data.appointmentDate}</span>
                </div>

                <span className={`priority-level ${data.priorityLevel.toLowerCase()}`}>
                  {data.priorityLevel}
                </span>
              </div>
            ))
          ) : (
            <p className='no-records'>No Recent requests found.</p>
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

export default RecentRequest;
