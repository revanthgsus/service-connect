import React, { useState } from 'react';
import './InvoiceModal.css'
import { Modal } from 'react-bootstrap';

const InvoiceModal = ({ show, onHide }) => {
  const [amount, setAmount] = useState("₹ ");

  const invoiceData = [
    { title: "Paid Amount", value: "₹ 500" },
    { title: "Due Amount", value: "₹ 100" },
    { title: "Total Amount", value: "₹ 2000" },
  ]

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value ? `₹ ${value}` : "₹ ");
  };
  return (
    <Modal show={show} onHide={onHide} animation className="invoice-popup">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>INV - 000001</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='invoice-container'>
          {invoiceData.map((amount, index) => (
            <span key={index} className='amount-details'>
              <h5 className='amount-heading'>{amount.title}</h5>
              <p className='amount-value'>{amount.value}</p>
            </span>
          ))}
        </div>
        <input
          type="text"
          className='enter-input'
          value={amount}
          onChange={handleChange} />
      </Modal.Body>
      <Modal.Footer className="border-0">
        <button className="payment-btn" onClick={onHide}>Proceed Payment</button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
