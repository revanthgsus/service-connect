import React from 'react';
import "./WarrantyModal.css";
import { Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import API_BASE_URL from '../../services/AuthService';
import axios from 'axios';

const WarrantyModal = ({ show, handleClose, warrantyData, onUpdateWarrantyStatus }) => {
  const userRole = sessionStorage.getItem("userRole");
  const token = sessionStorage.getItem("authToken");
  const { setShowTokenModal } = useAuth();

  const dataHeading = [
    { label: "Item Name", value: "itemName" },
    { label: "Purchase Date", value: "purchaseDate" },
    { label: "Expiry Date", value: "expiryDate" },
    { label: "Warranty Period", value: "warrantyPeriod" },
    { label: "Warranty Status", value: "warrantyStatus" },
  ];

  // change string to date format
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return "-";
    const date = new Date(...dateArray.slice(0, 3), dateArray[3], dateArray[4], dateArray[5]);
    return date.toLocaleDateString(); // or use toLocaleString() if you want time too
  };

  // warranty status change customer user
  const isViewAndClaim = warrantyData?.warrantyStatus === "View & claim";
  const showSendRequest = userRole === "Customer" &&
    (warrantyData?.warrantyStatus === "Warranty Covered");


  const showClaimActions = userRole === "Advisor" &&
    (warrantyData?.warrantyStatus === "View & claim");

  // request send api call
  const handleUpdateStatus = async (status) => {
    const complaintId = warrantyData?.complaintId;
    const appointmentId = warrantyData?.appointmentId;

    if (!complaintId) {
      toast.error("Complaint Id not found.");
      return
    }

    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/customerMaster/sendWarrantyRequest/${complaintId}/${status}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        handleClose();
        toast.success(response?.data?.message || "Warranty request updated successfully.");

        // Call the next API after success
        const result = await axios.get(`${API_BASE_URL}/advisorMaster/viewComplaintsByAppointmentId/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result?.status === "success") {
          onUpdateWarrantyStatus(result?.data?.complaints || []);
        }
      } else {
        toast.error(response?.data?.message || "Complaint ID not found.")
      }
    } catch {
      toast.error("Something went wrong. Please try again later.")
    }
  };


  return (
    <>
      <Modal show={show} onHide={handleClose} className='warranty-popup' animation>
        <Modal.Header className='border-0' closeButton >
          <h5>View Warranty</h5>
        </Modal.Header>
        <Modal.Body>
          <div className='warranty-data'>
            {dataHeading.map((item, index) => (
              <div key={index} className='warranty-info'>
                <h6>{item.label} :</h6>
                <p>
                  {(item.value === "purchaseDate" || item.value === "expiryDate")
                    ? formatDate(warrantyData?.[item.value])
                    : item.value === "warrantyStatus" && isViewAndClaim
                      ? "Warranty Covered"
                      : warrantyData?.[item.value] || "-"
                  }
                </p>
              </div>
            ))}
          </div>
        </Modal.Body>


        <Modal.Footer className='border-0'>
          {showSendRequest && (
            <div className='warranty-actions-btn'>
              <button
                onClick={() => handleUpdateStatus("sendRequest")}
                className='request-btn'>
                Send Request
              </button>
            </div>
          )}

          {showClaimActions && (
            <div className='warranty-actions-btn'>
              <button
                className='decline-btn'
                onClick={() => handleUpdateStatus("decline")}>Decline</button>
              <button
                className='claim-btn'
                onClick={() => handleUpdateStatus("claimNow")}>Claim Now</button>
            </div>
          )}

        </Modal.Footer>
      </Modal >

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default WarrantyModal;
