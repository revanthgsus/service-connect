import React, { useState } from 'react';
import './HistoryDetails.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import PreLoader from '../../../../../common/PreLoader/PreLoader';

const HistoryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentData } = location.state || {};
  const [isLoading, setIsLoading] = useState();

  const appointmentDetails = [
    { label: 'Service ID', value: appointmentData?.serviceId || '-' },
    { label: 'Advisor Name', value: appointmentData?.advisorName || '-' },
    { label: 'Company Name', value: appointmentData?.companyName || '-' },
    { label: 'Service Location', value: appointmentData?.preferredLocation || '-' },
    { label: 'Invoice Date', value: appointmentData?.invoiceDate || '-' },
    { label: 'Product Serial Number', value: appointmentData?.productSerialNumber || '-' },
    { label: 'Service Type', value: appointmentData?.serviceTypes || '-' },
    { label: 'Payment Status', value: appointmentData?.paymentStatus || '-' },
  ]

  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className='history-details'>
          <div className='history-header'>
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Service Details</h5>
            </div>
          </div>

          <div className="history-data">
            <h5 className="app-heading">Service Information</h5>
            <Row className='view-fields'>
              {appointmentDetails.map((field, index) => (
                <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                  <div className='input-wrapper'>
                    <div className='input-field'>
                      <h6>{field.label}</h6>
                      <p>{field.value}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}
    </>
  )
}

export default HistoryDetails;
