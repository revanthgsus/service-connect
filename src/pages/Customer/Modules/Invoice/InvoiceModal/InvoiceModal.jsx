import React, { useState } from 'react';
import './InvoiceModal.css'
import { Modal } from 'react-bootstrap';
// import payLogo from "../../../../../assets/images/logo/white-logo.svg"

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

  // script tag for razorpay
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // handleevent for integration
  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Failed to load payment. Please try again.");
      return;
    }

    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!numericAmount || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // loadRazorpay();
    const options = {
      key: "rzp_test_pXd22jxI88iJ4g",
      key_secret: "eTacN88F1EW2ebMo5zm2ozgR",
      amount: numericAmount * 100,
      currency: "INR",
      name: "Service Connect",
      description: `Invoice Payment INV-00001`,
      // image: payLogo,
      // order_Id: "order_ID",
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        onHide();
      },
      prefill: {
        name: "Revanth",
        email: "revanth2899@gmail.com",
        contact: "8056812955",
      },
      theme: {
        color: "#0098a2",
      },
      modal: {
        animation: true,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
        <button className="payment-btn" onClick={handlePayment}>Proceed Payment</button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
