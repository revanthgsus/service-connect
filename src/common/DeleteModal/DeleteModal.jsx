import React, { useState } from 'react';
import "./DeleteModal.css";
import { ReactComponent as Deleteicon } from "../../assets/images/comman/delete-icon.svg";
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({ show, handleClose, entityId, entityType, deleteEndpoint, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!entityId || !deleteEndpoint) return;
    setIsDeleting(true);
    setError(null);

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert("Session expired. Please sign in to continue.");
      navigate('/')
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}${deleteEndpoint}/${entityId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        handleClose();
        onDeleteSuccess();
      } else {
        setError(`Failed to delete ${entityType}. Please try again.`);
      }
    } catch (err) {
      setError(`An error occurred while deleting ${entityId}. Please try again`);
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
            <button onClick={handleDelete} className='dlt-confirm-btn' disabled={isDeleting}>Delete</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModal;
