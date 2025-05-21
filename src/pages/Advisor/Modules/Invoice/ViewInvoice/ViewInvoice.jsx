import React, { useEffect, useRef, useState } from "react";
import "./ViewInvoice.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import CustomLogo from "../../../../../common/MainLogo/CustomLogo";
import { useAuth } from "../../../../../contexts/AuthContext";
import axios from "axios";
import API_BASE_URL from "../../../../../services/AuthService";
import { toast, ToastContainer } from 'react-toastify';
import PreLoader from "../../../../../common/PreLoader/PreLoader";

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const location = useLocation();
  const { invoiceDetails, pdfUrl } = location.state || {};

  console.log(pdfUrl)

  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const pdfRef = useRef();

  const userRole = sessionStorage.getItem("userRole");

  const quotesHeading = [
    { title: "S.No" },
    { title: "Item Code" },
    { title: "Item Name" },
    { title: "Qty" },
    { title: "Labour Fee" },
    { title: "Tax" },
    { title: "Tax Amount" },
    { title: "Item Fee" },
    { title: "Tax" },
    { title: "Tax Amount" },
    { title: "Total Amount" },
  ];


  // fetch invoice details from api
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

      const invoiceId = invoiceDetails?.invoiceId;

      try {
        const response = await axios.get(`${API_BASE_URL}/paymentMaster/getInvoiceMasterByInvoiceId/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.status === "success") {
          setInvoiceData(response.data);
        } else {
          toast.error(response?.data?.message || "Failed to fetch Invoice details.");
        }
      } catch (error) {
        toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceDetails, setShowTokenModal]);


  // Destructure invoice data safely
  const {
    companyName = "",
    companyLocation = "",
    mobileNumber = "",
    customerName = "",
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    pincode = "",
    state = "",
    dueDate = "",
    subTotal = "0",
    discountAmount = "0",
    cgst = "0",
    sgst = "0",
    totalAmount = "0",
    advanceAmount = "0",
    dueAmount = "0",
    invoiceId = "",
  } = invoiceData?.data || {};

  // invoice data 
  const invoiceFrom = {
    title: "Bill From :",
    companyName,
    companyLocation,
    mobileNumber,
  };

  const invoiceTo = {
    title: "Bill To:",
    customerName,
    addressLine1,
    addressLine2,
    city,
    pincode,
    state,
    mobileNumber,
    dueDate,
  };

  const amountSummary = {
    subTotal,
    discountAmount,
    cgst,
    sgst,
    totalAmount,
    advanceAmount,
    dueAmount,
  };

  const quotesItems = invoiceData?.data?.activities || [];

  const handleDownload = (e) => {
    e.preventDefault();
    window.print();
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/advisor/invoice");
  };

  const handleSend = (e) => {
    e.preventDefault();
    navigate("/advisor/invoice");
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
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

          <div className="invoice-pdf" ref={pdfRef}>
            {/* <div class="invoice">
              <svg viewBox="0 0 1440 320">
                <path fill="#007D85" fill-opacity="1" d="M0,96L80,101.3C160,107,320,117,480,154.7C640,192,800,256,960,282.7C1120,309,1280,299,1360,293.3L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z">
                </path>
              </svg>
              <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 490" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150"><defs><linearGradient id="gradient" x1="88%" y1="83%" x2="12%" y2="17%"><stop offset="5%" stop-color="#007d85"></stop><stop offset="95%" stop-color="#007d85"></stop></linearGradient></defs><path d="M 0,500 L 0,187 C 142.40000000000003,132.86666666666667 284.80000000000007,78.73333333333332 453,113 C 621.1999999999999,147.26666666666668 815.2,269.93333333333334 984,322 C 1152.8,374.06666666666666 1296.4,355.5333333333333 1440,337 L 1440,500 L 0,500 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" class="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 250)">
              </path>
              </svg>
            </div> */}

            <div className="invoice-logo">
              <CustomLogo />
              <span>{invoiceId}</span>
            </div>


            <Row className="invoice-details">
              {[invoiceFrom, invoiceTo].map((data, index) => (
                <Col key={index} xxl={5} xl={5} lg={5} md={5}>
                  <div className="invoice-box">
                    <h6>{data.title}</h6>
                    <h6>{data.companyName || data.customerName}</h6>
                    <p>{data.addressLine1 || data.companyLocation}</p>
                    {data.addressLine2 && <p>{data.addressLine2}</p>}
                    {data.city && <p>{data.city}</p>}
                    {data.pincode && <p> {data.pincode}</p>}
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
                    {quotesItems.length === 0 ? (
                      <tr>
                        <td colSpan={quotesHeading.length}
                          style={{ textAlign: "center", padding: "30px" }}>
                          No items available.
                        </td>
                      </tr>
                    ) : (
                      quotesItems.map((quote, index) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="amount-container">
              <h6>Sub Total: <span className="amount-value">₹ {amountSummary.subTotal}</span></h6>
              <h6>Discount: <span className="amount-value">₹ {amountSummary.discountAmount}</span></h6>
              <h6>CGST (%): <span className="amount-value">₹ {amountSummary.cgst}</span></h6>
              <h6>SGST (%): <span className="amount-value">₹ {amountSummary.sgst}</span></h6>
              <h6>Total Amount: <span className="amount-value">₹ {amountSummary.totalAmount}</span></h6>
              {parseFloat(amountSummary.advanceAmount) > 0 && (
                <h6>Advance Paid:
                  <span className="amount-value">₹ {amountSummary.advanceAmount || '0'}</span>
                </h6>
              )}
              <h6>Total Due Amount: <span className="amount-value">₹ {amountSummary.dueAmount}</span></h6>
            </div>
          </div>
        </section >
      )}

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
