import React from 'react';
import './RecentRequest.css';
import DummyImg from '../../../../../assets/images/dummy.svg';
import { useNavigate } from 'react-router-dom';

const RecentRequest = () => {

  const navigate = useNavigate();
  const RequestData = [
    { id: 1, serviceId: 'SR_23456', scheduledDate: '01/12/2024', urgencyLevel: 'urgent' },
    { id: 2, serviceId: 'SR_23457', scheduledDate: '02/12/2024', urgencyLevel: 'high' },
    { id: 3, serviceId: 'SR_23458', scheduledDate: '03/12/2024', urgencyLevel: 'medium' },
    { id: 4, serviceId: 'SR_23459', scheduledDate: '04/12/2024', urgencyLevel: 'low' },
    { id: 5, serviceId: 'SR_23460', scheduledDate: '05/12/2024', urgencyLevel: 'urgent' },
    { id: 6, serviceId: 'SR_23461', scheduledDate: '06/12/2024', urgencyLevel: 'high' },
  ];

  const handleRequest = (e) => {
    e.preventDefault();
    navigate('/advisor/appointments/view')
  }

  return (
    <section className='recent-request'>
      <div className='request-header'>
        <h6>Recent Requests</h6>
      </div>
      <hr className='mt-1 horizontal-line' />

      <div className='request-list'>
        {RequestData.map((data) => (
          <div key={data.id} className="request-item" onClick={handleRequest}>
            <img src={DummyImg} alt="customer-img" className="customer-img" width="20%" />
            <div className="request-details">
              <h6>Service ID: {data.serviceId}</h6>
              <span>Scheduled Date: {data.scheduledDate}</span>
            </div>
            {/* <span className={`urgency-level ${data.urgencyLevel.toLowerCase()}`}>
              {data.urgencyLevel}
            </span> */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentRequest;
