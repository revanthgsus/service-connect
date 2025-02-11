import React from 'react';
import "./SelectedProvider.css";
import { HiOutlineUserCircle } from 'react-icons/hi2';

const SelectedProvider = ({ selectedAdvisor }) => {
  return (
    <>
      <div className="selected-container mt-3">
        <div className="advisor-profile">
          {selectedAdvisor && (
            <div className="selected-advisor">
              <h5>Selected Advisor</h5>
              <div className="advisor-card">
                <HiOutlineUserCircle size={40} />
                <div className="advisor-info">
                  <h6>{selectedAdvisor.name}</h6>
                  <p>{selectedAdvisor.center}</p>
                  <p>{selectedAdvisor.rating} | {selectedAdvisor.distance}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectedProvider;