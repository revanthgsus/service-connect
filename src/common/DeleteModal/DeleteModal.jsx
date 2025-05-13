import React, { useState } from 'react';
import "./DeleteModal.css";
import { ReactComponent as Deleteicon } from "../../assets/images/comman/delete-icon.svg";
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const DeleteModal = ({ show, handleClose, entityId, entityType, deleteEndpoint, onDeleteSuccess }) => {
  const { setShowTokenModal } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!entityId || !deleteEndpoint) return;

    setIsDeleting(true);
    setError(null);

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      setIsDeleting(false);
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}${deleteEndpoint}/${entityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === 'success') {
        handleClose();
        onDeleteSuccess(); // Call the getAll function to refresh the data
        toast.success(`${entityType} deleted successfully.`);
      } else {
        toast.error(`Failed to delete ${entityType}. Please try again.`);
        handleClose();
      }
    } catch (err) {
      toast.error(`An error occurred while deleting ${entityId}. Please try again`);
      handleClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal show={show} animation onHide={handleClose} className='Delete-popup'>
        <Modal.Header className='border-0' closeButton />
        <Modal.Body>
          <Deleteicon className='delete-popup-icon' />
          <h5>Confirm Delete</h5>
          <p>Are you sure you want to delete this? Please confirm if you want to proceed.</p>
          {error && <p className="error-message">{error}</p>}
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='delete-actions-btn'>
            <button onClick={handleClose} className='cancel-btn'>Cancel</button>
            <button onClick={handleDelete} className='dlt-confirm-btn' disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModal;
