import React, { useContext } from 'react';
import "./Logout.css";
import { ReactComponent as LogoutIcon } from "../../assets/images/comman/logout.svg";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../contexts/AuthContext';

const Logout = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/')
  }
  return (
    <>
      <Modal show={show} animation onHide={handleClose} className='Logout-popup' >
        <Modal.Header className='border-0' closeButton>
        </Modal.Header>
        <Modal.Body >
          <LogoutIcon className='logout-popup-icon' />
          <h5>Logout Confirmation</h5>
          <p>Are you sure you want to log out? You’ll need to sign in again to continue.</p>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='logout-actions-btn'>
            <button onClick={handleClose} className='cancel-btn'>Cancel</button>
            <button className='logout-btn' onClick={handleLogout}>Confirm</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Logout;