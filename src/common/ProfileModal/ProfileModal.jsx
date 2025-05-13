import React, { useEffect, useState } from 'react';
import './ProfileModal.css';
import { Modal } from 'react-bootstrap';
import { TbUserCircle } from "react-icons/tb";
import { toast } from 'react-toastify';

const ProfileModal = ({ showPopup, setShowPopup, setSelectedImage, selectedImage, uploadMediaFile }) => {
  const [file, setFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(selectedImage);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Upload image format
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
      setFile(selectedFile);
    }
  };

  // upload image if else condition
  const handleUpdateClick = async () => {
    if (!file) {
      toast.error("Please select an image.");
      return;
    }

    setIsUpdating(true);
    try {
      const imageUrl = await uploadMediaFile(file);
      setSelectedImage(imageUrl);
      setShowPopup(false);
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (previewImage?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setFile(null);
    setShowPopup(false);
    setPreviewImage(selectedImage);
  };

  return (
    <Modal show={showPopup} onHide={() => setShowPopup(false)} centered className='profile-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex justify-content-center'>
        <label htmlFor="fileInput" className="file-label">
          <div className="preview-container">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="preview-image"
                onError={() => { setPreviewImage(null) }} />
            ) : (
              <TbUserCircle className="default-icon" />
            )}
          </div>
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/png, image/jpeg, image/svg+xml, image/heif, image/webp"
          onChange={handleFileChange}
          className="file-input"
        />
      </Modal.Body>
      <Modal.Footer >
        <button className='cancel-btn' onClick={handleCancel}>Cancel</button>
        <button className='upload-btn' onClick={handleUpdateClick}
          disabled={isUpdating}>
          {isUpdating ? "Updating..." : "update"}
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default ProfileModal