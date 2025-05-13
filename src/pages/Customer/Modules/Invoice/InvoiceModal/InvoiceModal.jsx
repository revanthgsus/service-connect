import React, { useEffect, useState } from 'react';
import './InvoiceModal.css';
import { Modal } from 'react-bootstrap';
import payLogo from "../../../../../assets/images/logo/payment-logo.svg";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { useAuth } from '../../../../../contexts/AuthContext';
import FeedbackModal from '../../FeedbackModal/FeedbackModal';

const InvoiceModal = ({ show, onHide, invoice }) => {
  const [amount, setAmount] = useState('');
  const { setShowTokenModal } = useAuth();
  const [amountError, setAmountError] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (invoice?.dueAmount) {
      setAmount(`₹ ${invoice.dueAmount}`);
    }
  }, [invoice]);

  const invoiceData = [
    { title: "Paid Amount", value: `₹ ${invoice?.paidAmount || 0}` },
    { title: "Due Amount", value: `₹ ${invoice?.dueAmount || 0}` },
    { title: "Total Amount", value: `₹ ${invoice?.totalAmount || 0}` },
  ];

  // script tag for razorpay
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);


  // handle amount change eventz
  const handleAmountChange = (e) => {
    let rawValue = e.target.value.replace(/[^\d.]/g, '');
    rawValue = rawValue.replace(/(\..*?)\..*/g, '$1');

    // Limit to two decimal places
    const parts = rawValue.split('.');
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
    }
    const numericValue = parts.join('.');

    const amountValue = parseFloat(numericValue, 10);
    const dueAmount = invoice?.dueAmount || 0;

    if (amountValue > 100000 || amountValue > dueAmount) {
      setAmountError(true);
      return;
    }

    setAmountError(false);
    setAmount(numericValue ? `₹ ${numericValue}` : "₹ ");
  };

  // handleevent for integration
  const handlePayment = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Please check internet connection.");
      return;
    }

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''), 10);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const payload = {
      amount: numericAmount,
      invoiceId: invoice?.invoiceId,
      serviceId: invoice?.serviceId,
      customerId: invoice?.customerId,
      payment: "receipt",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/paymentMaster/createOrder`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      const data = response?.data;
      if (response?.status !== 200) {
        toast.error(response?.message || 'Payment initialization failed.');
        return;
      };

      const options = {
        key: data.key,
        amount: numericAmount * 100,
        currency: "INR",
        name: "Service Connect",
        description: `${invoice?.invoiceId || "Invoice ID"}`,
        image: payLogo,
        order_id: data.orderId,

        // After payment verify this signature
        handler: async (response) => {
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            const verifyResponse = await axios.post(`${API_BASE_URL}/paymentMaster/verifyPayment`, verifyPayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse?.status === 200) {
              onHide();
              toast.success("Payment Verified Successful! ");
              setTimeout(() => {
                toast.dismiss();
                setOrderId(response.razorpay_order_id);
                setShowFeedback(true);
              }, 1000);

            } else {
              toast.error(verifyResponse?.data?.message || "Payment verification failed.");
            }
          } catch {
            toast.error("An error occurred during payment verification. Please try again.");
          }
        },
        prefill: {
          name: invoice?.customerName || "",
          email: invoice?.emailAddress || "",
          contact: invoice?.mobileNumber || "",
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
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (!show) {
      setAmountError(false);
    }
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={onHide} animation className="invoice-popup">
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{invoice?.invoiceId || "Invoice"}</Modal.Title>
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
            className={`enter-input ${amountError ? 'input-error' : ''}`}
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter Amount" />

          <p className="error-text" style={{ visibility: amountError ? 'visible' : 'hidden' }}>
            Maximum allowed amount is ₹ {invoice?.dueAmount || 0}
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button className="payment-btn" onClick={handlePayment} disabled={amountError}>
            Proceed Payment</button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />

      <FeedbackModal show={showFeedback} onHide={() => setShowFeedback(false)}
        orderId={orderId} />
    </>
  );
};

export default InvoiceModal;
