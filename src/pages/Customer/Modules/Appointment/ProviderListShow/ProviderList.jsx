import React from 'react';
import "./ProviderList.css";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiOutlineUserCircle } from "react-icons/hi2";

const ProviderList = ({ show, handleClose, onSelectAdvisor }) => {

  const advisors = [
    {
      id: 1,
      name: "Gowtham",
      center: "Gowtham Service Center",
      rating: "⭐⭐⭐⭐⭐",
      distance: "5 Km away"
    },
    {
      id: 2,
      name: "Rahul",
      center: "Rahul Auto Service Center",
      rating: "⭐⭐⭐⭐",
      distance: "3 Km away"
    },
    {
      id: 3,
      name: "John",
      center: "John Auto Care",
      rating: "⭐⭐⭐⭐",
      distance: "10 Km away"
    },
  ];

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end'>
      <Offcanvas.Header closeButton className='advisor-heading'>
        <Offcanvas.Title>Nearby Service Advisors</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className='provider-list'>
          {advisors.map((advisor) => (
            <label key={advisor.id} htmlFor={`advisor-${advisor.id}`} className="radio-label">
              <div className="radio-wrapper">
                <input
                  type="radio"
                  id={`advisor-${advisor.id}`}
                  name="advisor"
                  className="hidden"
                  checked={onSelectAdvisor?.id === advisor.id}
                  onChange={() => onSelectAdvisor(advisor)}
                />
                <div className="item d-flex">
                  <div className="advisor-detail">
                    <div className='suggestion-advisor'>
                      <div className='name-container'>
                        <HiOutlineUserCircle />
                        <div className='first-container'>
                          <h6>{advisor.name}</h6>
                          <p>{advisor.center}</p>
                        </div>
                      </div>
                      <div className='second-container'>
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
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProviderList;
