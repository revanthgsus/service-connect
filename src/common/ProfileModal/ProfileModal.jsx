import React, { useState } from 'react';
import './ProfileModal.css';
import { Modal } from 'react-bootstrap';
import { TbUserCircle } from "react-icons/tb";
import { toast } from 'react-toastify';

const ProfileModal = ({ showPopup, setShowPopup, setSelectedImage, selectedImage, uploadMediaFile }) => {
  const [file, setFile] = useState(null);

  // Upload image format
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
      setFile(selectedFile);
    }
  };

  // if else condition for onclick event
  const handleUpdateClick = async () => {
    if (file) {
      try {
        await uploadMediaFile(file, setSelectedImage);
        setShowPopup(false);
      } catch (error) {
        toast.error("Failed to upload image, please try again.");
      }
    } else {
      toast.error("Please select an image.");
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
    setSelectedImage(selectedImage);
  }

  return (
    <>
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered className='profile-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-center'>
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
            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/heif, image/heic"
            onChange={handleFileChange}
            className="file-input"
          />
        </Modal.Body>
        <Modal.Footer >
          <button className='cancel-btn' onClick={handleCancelClick}>Cancel</button>
          <button className='upload-btn' onClick={handleUpdateClick}>Update</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfileModal