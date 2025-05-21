import React, { useCallback, useEffect, useState } from 'react';
import './ProfileModal.css';
import { Modal } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage';

const ProfileModal = ({ showPopup, setShowPopup, setSelectedImage, selectedImage, uploadMediaFile, tempImageUrl }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (tempImageUrl) {
      setImageSrc(tempImageUrl);
    }
  }, [tempImageUrl]);


  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);


  // upload image if else condition
  const handleUpdateClick = async () => {
    if (!imageSrc) {
      toast.error("Please select an image.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      setIsUpdating(false);
      return;
    }

    setIsUpdating(true);

    try {
      const { blob } = await getCroppedImg(imageSrc, croppedAreaPixels);
      const extension = blob.type.split("/")[1];
      const newFileName = `profile_${userId}.${extension}`;
      const croppedFile = new File([blob], newFileName, { type: blob.type });

      const imageUrl = await uploadMediaFile(croppedFile);
      if (imageUrl) {
        setSelectedImage(imageUrl);
        setShowPopup(false);
      }
    } catch (error) {
      toast.error("Something went wrong. please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };


  const handleCancel = () => {
    if (imageSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    setShowPopup(false);
    setImageSrc(selectedImage || null);
  };


  return (
    <Modal show={showPopup} onHide={() => setShowPopup(false)} centered className='profile-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex justify-content-center'>
        <div className="preview-container">
          {imageSrc ? (
            <div className="crop-container">
              <Cropper
                className='cropper'
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape='round'
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            selectedImage ? (
              <img
                key={selectedImage}
                src={selectedImage}
                alt="Current"
                className="preview-image" />
            ) : (
              <FaUserCircle className="default-icon" />
            )
          )}
        </div>
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