import React from 'react';
import './ViewAppointment.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import SelectedProvider from './../SelectedProvider/SelectedProvider';

const ViewAppointment = ({ selectedAdvisor }) => {
  const navigate = useNavigate();

  const appointmentData = [
    {
      label: 'Service Type',
      name: 'servicetype',
      value: 'Car Routine Maintenance'
    },
    {
      label: 'Preferred Location',
      name: 'preferelocation',
      value: 'kumaran colony,vadapalani'
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
  return (
    <>
      <section className='appointment-summary'>
        <div className='appointment-header'>
          <div className="header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>View Appointment</h5>
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

        <SelectedProvider selectedAdvisor={selectedAdvisor} />

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
      </section>
    </>
  )
}

export default ViewAppointment