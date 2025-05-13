import React, { useEffect, useState } from 'react';
import "./SelectedProvider.css";
import { HiMiniUserCircle } from "react-icons/hi2";
import UPLOAD_FILE_API from '../../../../../services/UploadFile';
import Skeleton from '@mui/material/Skeleton';

const SelectedProvider = ({ selectedAdvisor }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [selectedAdvisor?.imageId]);

  const getImageUrl = (imageId) => {
    if (!imageId) return;
    return `${UPLOAD_FILE_API}/v1/view/${imageId}`;
  };

  const handleImageLoad = () => { setImageLoaded(true) };
  const handleImageError = () => { setImageError(true) };

  return (
    <>
      <div className="selected-container mt-4">
        <div className="advisor-profile">
          {selectedAdvisor && (
            <div className="advisor-info">
              <div className="name-container">
                {selectedAdvisor.imageId && !imageError ? (
                  <div className="image-wrapper">
                    {!imageLoaded && (
                      <Skeleton variant="circular" width={45} height={45} />
                    )}
                    <img
                      src={getImageUrl(selectedAdvisor.imageId)}
                      alt="profile"
                      className="profile-image"
                      style={{ display: imageLoaded ? "block" : "none" }}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                ) : (
                  <HiMiniUserCircle className="profile-icon" />
                )}

                <div className="first-container">
                  <h6>{selectedAdvisor.userName}</h6>
                  <p>{selectedAdvisor.companyAddress}</p>
                </div>
              </div>
              <div className="second-container">
                <p>{selectedAdvisor.rating || "⭐"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectedProvider;