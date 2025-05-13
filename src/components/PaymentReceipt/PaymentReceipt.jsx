import React from 'react';
import './PaymentReceipt.css';

const PaymentReceipt = ({ transaction }) => {
  if (!transaction) {
    return <p className="error-message">No transaction data available.</p>;
  }

  const handleDownload = () => {
    const receiptContent = `
    Transaction Receipt
    -------------------
    Service ID: ${transaction.serviceID}
    Invoice ID: ${transaction.invoiceID}
    Transaction ID: ${transaction.transactionID}
    Payment Mode: ${transaction.paymentMode}
    Date of Payment: ${transaction.paidDate}
    Paid Amount: ${transaction.paidAmount}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${transaction.transactionID}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="payment-receipt">
      <h3>Payment Receipt</h3>
      <div className="receipt-details">
        <p><strong>Service ID:</strong> {transaction.serviceID}</p>
        <p><strong>Invoice ID:</strong> {transaction.invoiceID}</p>
        <p><strong>Transaction ID:</strong> {transaction.transactionID}</p>
        <p><strong>Payment Mode:</strong> {transaction.paymentMode}</p>
        <p><strong>Date of Payment:</strong> {transaction.paidDate}</p>
        <p><strong>Paid Amount:</strong> {transaction.paidAmount}</p>
      </div>
      <button onClick={handleDownload} className="download-btn">
        Download Receipt
      </button>
    </div>
  );
};

export default PaymentReceipt;
