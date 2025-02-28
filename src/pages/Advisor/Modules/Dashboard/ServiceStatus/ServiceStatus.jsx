import React from 'react';
import './ServiceStatus.css';
import { Col, Row } from 'react-bootstrap';
import { ReactComponent as CompleteIcon } from '../../../../../assets/images/advisor/dashboard/completed.svg';
import { ReactComponent as InprogressIcon } from '../../../../../assets/images/advisor/dashboard/inprogress.svg';
import { ReactComponent as CancelIcon } from '../../../../../assets/images/advisor/dashboard/cancel.svg';

const ServiceStatus = () => {
  return (
    <>
      <section className='service-kpi'>
        <Row>
          <Col xxl={4} xl={4} lg={4} md={4}>
            <div className='service-container completed'>
              <div className='service-value'>
                <h6>Completed Services</h6>
                <h3>12</h3>
              </div>
              <div className='service-icon'>
                <CompleteIcon />
              </div>
            </div>
          </Col>
          <Col xxl={4} xl={4} lg={4} md={4}>
            <div className='service-container inprogress'>
              <div className='service-value'>
                <h6>In Progress Services</h6>
                <h3>12</h3>
              </div>
              <div className='service-icon'>
                <InprogressIcon />
              </div>
            </div>
          </Col>
          <Col xxl={4} xl={4} lg={4} md={4}>
            <div className='service-container cancel'>
              <div className='service-value'>
                <h6>Canceled &emsp; Services</h6>
                <h3>12</h3>
              </div>
              <div className='service-icon'>
                <CancelIcon />
              </div>
            </div>
          </Col>
        </Row>
      </section >
    </>
  )
}

export default ServiceStatus