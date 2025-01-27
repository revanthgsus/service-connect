import React from 'react';
import "./ProviderList.css";
import { FaRegUserCircle } from "react-icons/fa";

const ProviderList = () => {
  return (
    <>
      <section className='provider-list'>
        <h5 className="nearby-advisor">Nearby Service Advisors</h5>
        <div className="checkbox-wrapper">
          <div className="item d-flex">
            <input type="checkbox" id="advisor-1" className="hidden" />
            <label htmlFor="advisor-1" className="cbx">
              <svg width="14px" height="12px" viewBox="0 0 14 12">
                <polyline points="2 7.6 5 11 13 1"></polyline>
              </svg>
            </label>
            <label htmlFor="advisor-1" className="advisor-detail">
              <div className='suggestion-advisor'>
                <div>
                  <FaRegUserCircle />
                  <h5>Gowtham</h5>
                  <p>ABC Service Center</p>
                </div>
                <div>
                  <h5>⭐</h5>
                  <p>5 Km away</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProviderList;
