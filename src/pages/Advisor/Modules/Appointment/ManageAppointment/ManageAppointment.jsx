import React, { useState } from 'react';
import './ManageAppointment.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { Col, Row } from 'react-bootstrap';
import RejectModal from '../../../../../common/RejectModal/RejectModal';

const ManageAppointment = () => {
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);

  const appointmentData = [
    {
      label: 'Customer Name',
      name: 'customername',
      value: 'Revanth'
    },
    {
      label: 'Email Address',
      name: 'emailaddress',
      value: 'revanthdemo@gmail.com'
    },
    {
      label: 'Mobile Number',
      name: 'mobilenumber',
      value: '9876543210'
    },
    {
      label: 'Service Type',
      name: 'servicetype',
      value: 'Car Routine Maintenance'
    },
    {
      label: 'Appointment Date',
      name: 'appointmentdate',
      value: '01/02/2025'
    },
    {
      label: 'Start Time',
      name: 'starttime',
      value: '09.00AM'
    },
    {
      label: 'Preferred Location',
      name: 'preferelocation',
      value: 'kumaran colony,vadapalani'
    },
    {
      label: 'Product Name',
      name: 'productname',
      value: 'Car'
    },
    {
      label: 'Product Serial Number',
      name: 'serialnumber',
      value: 'EX12345BAT2023'
    },
    {
      label: 'Urgency Level',
      name: 'urgencylevel',
      value: 'Urgent'
    },
  ]

  const ItemHeading = [
    { title: "S.No" },
    { title: "Item List" },
    { title: "Description" },
  ];

  const ItemList = [
    {
      id: 1,
      itemList: "Filter Replacement",
      description: "Changing air and oil filters to ensure clean air and oil flow, which improves performance and fuel efficiency",
    },
    {
      id: 2,
      itemList: "Brake Check",
      description: "Inspecting brake pads, rotors, and fluid to make sure your car can stop safely when needed",
    },
    {
      id: 3,
      itemList: "Oil Change",
      description: "Replacing old engine oil with fresh oil to keep the engine running smoothly and prevent overheating or damage.",
    },
    {
      id: 4,
      itemList: "Brake Check",
      description: "Inspecting brake pads, rotors, and fluid to make sure your car can stop safely when needed",
    },
  ];

  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1)
  }

  const handleReject = () => {
    setShowRejectModal(true);
  }

  const handleAccept = (e) => {
    e.preventDefault()
    navigate('/advisor/appointments/quote')
  }
  return (
    <>
      <section className='appointment-summary'>
        <div className='appointment-header'>
          <div className="header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Manage Your Appointments</h5>
          </div>
        </div>

        <div className="appointment-data">
          <h5 className="app-heading">Appointment Details</h5>
          <Row className='view-fields'>
            {appointmentData.map((field, index) => (
              <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                <div className="input-wrapper">
                  <div className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      id={field.name}
                      type="text"
                      name={field.name}
                      className="form-control"
                      value={field.value}
                      readOnly />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="table-list mt-4">
          <div className="list-alignment">
            <table className="quote-table">
              <thead className="table-align">
                <tr>
                  {ItemHeading.map((heading, index) => (
                    <th key={index} className="table-heading">
                      {heading.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ItemList.map((quote, index) => (
                  <tr key={quote.id} className="list-item">
                    <td>{index + 1}</td>
                    <td>{quote.itemList}</td>
                    <td>{quote.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='accept-button-container'>
          <button type='submit' className='decline-button' onClick={handleReject}> <MdOutlineCancel />
            Reject</button>
          <button type='submit' className='accept-button' onClick={handleAccept}><BsFillHandThumbsUpFill />
            Accept</button>
        </div>
      </section>

      <RejectModal showRejectModal={showRejectModal} handleCloseReject={() => setShowRejectModal(false)} />
    </>
  )
}

export default ManageAppointment