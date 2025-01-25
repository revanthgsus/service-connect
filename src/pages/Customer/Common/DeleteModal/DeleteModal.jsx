import React from 'react';
import "./DeleteModal.css";
import Deleteicon from "../../../../assets/images/admin/delete-icon.svg";
import { Modal } from 'react-bootstrap';

const DeleteModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} animation onHide={handleClose} className='Delete-popup' >
        <Modal.Header className='border-0'>
          <img src={Deleteicon} alt='deleteicon' className='delete-popup-icon' />
        </Modal.Header>
        <Modal.Body >
          <h5>Confirm Delete</h5>
          <p>Are you sure you want to delete this? Please confirm if you want to proceed.</p>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='delete-actions-btn'>
            <button onClick={handleClose} className='cancel-btn'>Cancel</button>
            <button className='dlt-confirm-btn'>Delete</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal;