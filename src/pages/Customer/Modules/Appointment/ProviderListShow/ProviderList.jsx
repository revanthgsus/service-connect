import React, { useState, useEffect } from 'react';
import "./ProviderList.css";
import Offcanvas from 'react-bootstrap/Offcanvas';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { HiMiniUserCircle } from "react-icons/hi2";
import UPLOAD_FILE_API from '../../../../../services/UploadFile';
import Skeleton from '@mui/material/Skeleton';
import { Box, Rating, SvgIcon, useTheme } from '@mui/material';
import { HiOutlineStar } from "react-icons/hi2";

const ProviderList = ({ show, handleClose, onSelectAdvisor, advisors }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const theme = useTheme();

  useEffect(() => {
    if (show) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleSelect = (advisorId) => {
    setSelectedId(advisorId);
  };

  const handleConfirmSelection = () => {
    const selectedAdvisor = advisors.find((advisor) => advisor.advisorId === selectedId);
    if (selectedAdvisor) {
      onSelectAdvisor(selectedAdvisor);
      handleClose();
    }
  };

  const getImageUrl = (imageId) => {
    if (!imageId) return;
    return `${UPLOAD_FILE_API}/v1/view/${imageId}`;
  };


  const RoundedStar = (props) => (
    <SvgIcon {...props}>
      <path
        d="M12 2.5c.5 0 1 .3 1.2.8l2.4 4.9 5.3.8c.5.1.9.5 1 1 .1.5-.1 1-.5 1.3l-3.8 3.7.9 5.3c.1.5-.1 1-.5 1.3-.4.3-.9.3-1.4.1L12 18.8l-4.8 2.5c-.5.2-1 .2-1.4-.1-.4-.3-.6-.8-.5-1.3l.9-5.3L2.4 11c-.4-.3-.6-.8-.5-1.3.1-.5.5-.9 1-1l5.3-.8 2.4-4.9c.2-.5.7-.8 1.2-.8z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0"
      />
    </SvgIcon>
  );

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="advisor-heading">
        <Offcanvas.Title>Nearby Service Advisors</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <PreLoader />
        ) : advisors.length === 0 ? (
          <p className="no-advisors-msg">No advisors available for the selected location.</p>
        ) : (
          <div className="provider-list">
            {advisors.map((advisor) => (
              <label key={advisor.advisorId} htmlFor={`advisor-${advisor.advisorId}`} className="radio-label">
                <div className="radio-wrapper">
                  <input
                    type="radio"
                    id={`advisor-${advisor.advisorId}`}
                    name="advisor"
                    className="hidden"
                    checked={selectedId === advisor.advisorId}
                    onChange={() => handleSelect(advisor.advisorId)}
                  />

                  <div className="item d-flex">
                    <div className="advisor-detail">
                      <div className="suggestion-advisor">
                        <div className="name-container">
                          {advisor.imageId && !loadedImages[advisor.imageId + "_error"] ? (
                            <div className="image-wrapper">
                              {!loadedImages[advisor.imageId] && (
                                <Skeleton variant="circular" width={45} height={45} />
                              )}
                              <img
                                src={getImageUrl(advisor.imageId)}
                                alt="profile"
                                className="profile-image"
                                style={{ display: loadedImages[advisor.imageId] ? "block" : "none" }}
                                onLoad={() =>
                                  setLoadedImages((prev) => ({ ...prev, [advisor.imageId]: true }))
                                }
                                onError={() =>
                                  setLoadedImages((prev) => ({ ...prev, [advisor.imageId + "_error"]: true }))
                                }
                              />
                            </div>
                          ) : (
                            <HiMiniUserCircle className="profile-icon" />
                          )}

                          <div className="first-container">
                            <h6>{advisor.userName}</h6>
                            <p>{advisor.companyAddress}</p>
                          </div>
                        </div>

                        <div className="second-container">
                          <Box>
                            {advisor?.rating > 0 && (
                              <Rating
                                value={advisor.rating}
                                precision={0.1}
                                readOnly
                                icon={<RoundedStar sx={{ fontSize: 17 }} />}
                                emptyIcon={
                                  <HiOutlineStar
                                    style={{
                                      fontSize: 17,
                                      color: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                                    }}
                                  />
                                }
                              />
                            )}
                          </Box>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </Offcanvas.Body>

      <div className="offcanvas-footer">
        <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
        <button type="button" className="select-btn" onClick={handleConfirmSelection} disabled={!selectedId || advisors.length === 0}>Select</button>
      </div>
    </Offcanvas >
  );
};

export default ProviderList;
