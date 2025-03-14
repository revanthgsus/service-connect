import React from 'react';
import "./TokenModal.css";
import { ReactComponent as SessionIcon } from "../../assets/images/comman/session-icon.svg";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TokenModal = ({ showTokenModal, handleClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    handleClose();
    navigate('/');
  }

  return (
    <>
      <Modal show={showTokenModal} animation onHide={handleClose} className='token-popup' backdrop="static">
        <Modal.Body>
          <SessionIcon className='token-popup-icon' />
          <h5>Session Expired</h5>
          <p>Your session has expired. Please log in again to continue.</p>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <button onClick={handleLogout} className='confirm-btn'>Go to Login</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TokenModal;
