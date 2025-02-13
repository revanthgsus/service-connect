import React, { useMemo, useState, useEffect } from 'react';
import "./ProviderList.css";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiOutlineUserCircle } from "react-icons/hi2";
import PreLoader from '../../../../../common/PreLoader/PreLoader';

const ProviderList = ({ show, handleClose, onSelectAdvisor }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const advisors = useMemo(() => [
    { id: 1, name: "Gowtham", center: "Gowtham Service Center", rating: "⭐⭐⭐⭐⭐", distance: "5 Km away" },
    { id: 2, name: "Rahul", center: "Rahul Auto Service Center", rating: "⭐⭐⭐⭐", distance: "3 Km away" },
    { id: 3, name: "John", center: "John Auto Care", rating: "⭐⭐⭐⭐", distance: "10 Km away" }
  ], []);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleConfirmSelection = () => {
    const selectedAdvisor = advisors.find((advisor) => advisor.id === selectedId);
    if (selectedAdvisor) {
      onSelectAdvisor(selectedAdvisor);
      handleClose();
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="advisor-heading">
        <Offcanvas.Title>Nearby Service Advisors</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <PreLoader />
        ) : (
          <div className="provider-list">
            {advisors.map((advisor) => (
              <label key={advisor.id} htmlFor={`advisor-${advisor.id}`} className="radio-label">
                <div className="radio-wrapper">
                  <input
                    type="radio"
                    id={`advisor-${advisor.id}`}
                    name="advisor"
                    className="hidden"
                    checked={selectedId === advisor.id}
                    onChange={() => handleSelect(advisor.id)}
                  />
                  <div className="item d-flex">
                    <div className="advisor-detail">
                      <div className="suggestion-advisor">
                        <div className="name-container">
                          <HiOutlineUserCircle />
                          <div className="first-container">
                            <h6>{advisor.name}</h6>
                            <p>{advisor.center}</p>
                          </div>
                        </div>
                        <div className="second-container">
                          <p>{advisor.rating}</p>
                          <p>{advisor.distance}</p>
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
        <button type="button" className="select-btn" onClick={handleConfirmSelection} disabled={!selectedId}>
          Select
        </button>
      </div>
    </Offcanvas>
  );
};

export default ProviderList;
