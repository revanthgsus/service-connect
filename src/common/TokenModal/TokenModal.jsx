import React from 'react';
import "./TokenModal.css";
import { ReactComponent as SessionIcon } from "../../assets/images/comman/session-icon.svg";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TokenModal = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    handleClose();
    navigate('/')
  }

  return (
    <>
      <Modal show={show} animation onHide={handleLogout} className='token-popup'>
        <Modal.Header className='border-0' />
        <Modal.Body>
          <SessionIcon className='token-popup-icon' />
          <h5>Session Expired</h5>
          <p>Your session has expired. Please log in again to continue.</p>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='confirm-btn'>
            <button onClick={handleLogout} className='confirm-btn'>Ok</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TokenModal;
