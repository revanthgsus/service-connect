import React, { useEffect, useState } from "react";
import "./ViewInvoice.css";
import CustomLogo from "../../../../../common/MainLogo/CustomLogo";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../contexts/AuthContext";
import axios from "axios";
import API_BASE_URL from "../../../../../services/AuthService";
import { toast, ToastContainer } from 'react-toastify';
import PreLoader from "../../../../../common/PreLoader/PreLoader";

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const location = useLocation();
  const { invoiceDetails } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");
  const userRole = sessionStorage.getItem("userRole");

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setShowTokenModal(true);
        return;
      }

      if (!invoiceDetails?.invoiceId) {
        toast.error("Invoice details not available.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/paymentMaster/getInvoiceMasterByInvoiceId/${invoiceDetails.invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.status === "success") {
          setInvoiceData(response.data);
        } else {
          toast.error(response?.data?.message || "Failed to fetch Invoice data.");
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceDetails, setShowTokenModal]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleSend = (e) => {
    e.preventDefault();
    navigate("/advisor/invoice");
  };

  if (isLoading) {
    return <PreLoader />;
  }

  if (!invoiceData) {
    return (
      <>
        <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} theme="light" />
      </>
    );
  }

  const invoiceFrom = {
    title: "Bill From:",
    companyName: companyName || "",
    companyLocation: companyLocation || "",
    mobileNumber: invoiceData.data.mobileNumber || ""
  };

  const invoiceTo = {
    title: "Bill To:",
    customerName: invoiceData.data.customerName || "",
    addressLine1: invoiceData.data.addressLine1 || "",
    addressLine2: invoiceData.data.addressLine2 || "",
    mobileNumber: invoiceData.data.mobileNumber || "",
    dueDate: invoiceData.data.dueDate || "",
  };

  const quotesHeading = [
    { title: "S.No" },
    { title: "Item Code" },
    { title: "Item Name" },
    { title: "Quantity" },
    { title: "Labour Fee" },
    { title: "Labour Tax" },
    { title: "Tax Amount" },
    { title: "Item Fee" },
    { title: "Item Tax" },
    { title: "Tax Amount" },
    { title: "Total Amount" },
  ];

  const quotesItems = invoiceData?.data?.activities || [];

  const amountSummary = {
    subTotal: invoiceData?.data?.subTotal || "0",
    discountAmount: invoiceData?.data?.discountAmount || "0",
    CGST: invoiceData?.data?.cgst || "0",
    SGST: invoiceData?.data?.sgst || "0",
    totalAmount: invoiceData?.data?.totalAmount || "0",
    advanceAmount: invoiceData?.data?.advanceAmount || "0",
    dueAmount: invoiceData?.data?.dueAmount || "0",
  };

  const handleDownload = (e) => {
    e.preventDefault();
    window.print();
  };


  return (
    <>
      <section className="invoice-container">
        <div className="invoice-header-container">
          <div className="invoice-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Invoice</h5>
          </div>

          {userRole === "Customer" ? (
            <button type="button" className="add-button" onClick={handleDownload}>Download</button>
          ) : (
            <button type="button" className="add-button" onClick={handleSend}>Send</button>
          )}
        </div>

        <div className="invoice-pdf">
          <div className="invoice-logo">
            <CustomLogo />
            <span>{invoiceData?.data?.invoiceId}</span>
          </div>

          <Row className="invoice-details">
            {[invoiceFrom, invoiceTo].map((data, index) => (
              <Col key={index} xxl={5} xl={5} lg={5} md={5}>
                <div className="invoice-box">
                  <h6>{data.title}</h6>
                  <h6>{data.companyName || data.customerName}</h6>
                  <p>{data.addressLine1 || data.companyLocation}</p>
                  <p>{data.addressLine2}</p>
                  <p>Mobile: {data.mobileNumber}</p>
                  {data.dueDate && <p>Due Date: {data.dueDate}</p>}
                </div>
              </Col>
            ))}
          </Row>

          <div className="table-list">
            <div className="list-alignment">
              <table className="quote-table">
                <thead className="table-align">
                  <tr>
                    {quotesHeading.map((heading, index) => (
                      <th key={index} className="table-heading">
                        {heading.title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {quotesItems.map((quote, index) => (
                    <tr key={quote.id || index} className="list-item">
                      <td>{index + 1}</td>
                      <td>{quote.itemNo}</td>
                      <td>{quote.itemList}</td>
                      <td>{quote.quantity}</td>
                      <td>₹ {quote.labourFee}</td>
                      <td>{quote.labourTax}%</td>
                      <td>₹ {quote.labourTaxableAmount}</td>
                      <td>₹ {quote.itemFee}</td>
                      <td>{quote.itemTax}%</td>
                      <td>₹ {quote.itemTaxableAmount}</td>
                      <td>₹ {quote.rowTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="amount-container">
            <h6>Sub Total: <span className="amount-value">₹ {amountSummary.subTotal}</span></h6>
            <h6>Discount: <span className="amount-value">₹ {amountSummary.discountAmount}</span></h6>
            <h6>CGST (%): <span className="amount-value">₹ {amountSummary.CGST}</span></h6>
            <h6>SGST (%): <span className="amount-value">₹ {amountSummary.SGST}</span></h6>
            <h6>Total Amount: <span className="amount-value">₹ {amountSummary.totalAmount}</span></h6>
            {parseFloat(amountSummary.advanceAmount) > 0 && (
              <h6>Advance Paid:
                <span className="amount-value">₹ {amountSummary.advanceAmount || '0'}</span>
              </h6>
            )}
            <h6>Total Due Amount: <span className="amount-value">₹ {amountSummary.dueAmount}</span></h6>
          </div>
        </div>
      </section>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default ViewInvoice;
