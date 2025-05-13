import React from 'react';
import './ServiceKpi.css';
// import { ReactComponent as CompletedIcon } from "../../../../../assets/images/customer/dashboard/completed.svg";
// import { ReactComponent as InprogressIcon } from "../../../../../assets/images/customer/dashboard/inprogress.svg";
// import { ReactComponent as TotalIcon } from "../../../../../assets/images/customer/dashboard/inprogress.svg";

const ServiceKpi = () => {
  return (
    <>
      <div className='service-data'>
        <div className='data-container'>
          <h6>Completed Services</h6>
          <div className='completed-data'>
            <h4>12</h4>
            {/* <span><CompletedIcon className='completed-icon' /></span> */}
          </div>
        </div>
        <div className='data-container'>
          {/* <InprogressIcon /> */}
          <h6>In Progress Service</h6>
          <h4>10</h4>
        </div>
        <div className='data-container'>
          {/* <TotalIcon /> */}
          <h6>Total service</h6>
          <h4>10</h4>
        </div></div>
    </>
  )
}

export default ServiceKpi;