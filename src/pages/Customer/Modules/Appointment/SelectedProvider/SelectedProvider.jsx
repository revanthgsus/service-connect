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
              <div className="item d-flex">
                <div className="advisor-detail w-100">
                  <div className="advisor-info">
                    <div className="name-container">
                      <HiOutlineUserCircle />
                      <div className="first-container">
                        <h6>{selectedAdvisor.name}</h6>
                        <p>{selectedAdvisor.center}</p>
                      </div>
                    </div>
                    <div className="second-container">
                      <p>{selectedAdvisor.rating}</p>
                      <p>{selectedAdvisor.distance}</p>
                    </div>
                  </div>
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