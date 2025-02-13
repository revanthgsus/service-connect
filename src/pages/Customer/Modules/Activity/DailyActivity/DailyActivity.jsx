import React, { useState } from 'react';
import "./DailyActivity.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const DailyActivity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const activityHeading = {
    advisorName: "John Doe",
    serviceId: "SRVC_00005",
  };

  const handleBack = (e) => {
    e.preventDefault();
    setLoading(false);
    navigate(-1);
  };
  return (
    <>
      {loading && <PreLoader />}
      {!loading && (
        <section className='activity-container'>
          <div className="activity-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Additional quotes</h5>
          </div>
          <div className='activity-top'>
            <p>{activityHeading.advisorName}</p>
            <p>{activityHeading.serviceId}</p>
          </div>
          <div className='activity-status'>
            <p>service activity</p>
          </div>
        </section>
      )}
    </>
  )
}

export default DailyActivity