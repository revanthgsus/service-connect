import React from 'react';
import './ProfileModal.css';
import { Modal } from 'react-bootstrap';
import { TbUserCircle } from "react-icons/tb";

const ProfileModal = ({ showPopup, setShowPopup, setSelectedImage, selectedImage }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };
  return (
    <>
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered className='profile-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="fileInput" className="file-label">
            <div className="preview-container">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="preview-image" />
              ) : (
                <TbUserCircle className="default-icon" />
              )}
            </div>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/png, image/jpeg, image/jpg, image/svg, image/heif, image/heic"
            onChange={handleFileChange}
            className="file-input"
          />
        </Modal.Body>
        <Modal.Footer >
          <button className='cancel-btn' onClick={() => setShowPopup(false)}>
            Cancel
          </button>
          <button className='upload-btn' onClick={() => setShowPopup(false)}>
            Update
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfileModal