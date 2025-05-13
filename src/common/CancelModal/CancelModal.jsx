import React from 'react';
import "./CancelModal.css";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CancelIcon } from "../../assets/images/comman/cancel-icon.svg"

const CancelModal = ({ cancelShow, handleCancelClose }) => {
  const navigate = useNavigate();

  const handleExit = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <>
      <Modal show={cancelShow} animation={false} onHide={handleCancelClose} className='Cancel-popup' >
        <Modal.Header className='border-0' closeButton>
        </Modal.Header>
        <Modal.Body >
          <CancelIcon className='Cancel-popup-icon' />
          <h5>Are you sure to cancel?</h5>
          <p>You haven't saved your changes. They will be lost if you cancel.</p>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='cancel-actions-btn'>
            <button onClick={handleCancelClose} className='cancel-btn'>No, Don't Exit</button>
            <button onClick={handleExit} className='yes-btn'>Yes, Exit</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CancelModal;