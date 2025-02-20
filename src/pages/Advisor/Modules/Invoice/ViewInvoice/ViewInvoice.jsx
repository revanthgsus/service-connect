import React from "react";
import "./ViewInvoice.css";
import CustomLogo from "../../../../../common/MainLogo/CustomLogo";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewInvoice = () => {
  const navigate = useNavigate()
  const invoiceFrom = {
    title: "Bill From:",
    shopName: "Abc Auto Repair Shop",
    address: "124, Gandhi Nagar, Thousand Light, Chennai - 600020",
    emailAddress: "gowthamdemo@gmail.com",
    mobileNumber: "9876543210",
  };

  const invoiceTo = {
    title: "Bill To:",
    customerName: "Revanth",
    address: "124, Kumaran Colony, Vadapalani, Chennai - 600200",
    mobileNumber: "9876543210",
    dueDate: "12/02/2025",
  };

  const QuotesHeading = [
    { title: "S.No" },
    { title: "Item List" },
    { title: "Description" },
    { title: "Labor Fee" },
    { title: "Item Fee" },
    { title: "Total Amount" },
  ];

  const QuotesItems = [
    {
      id: 1,
      itemList: "Filter Replacement",
      description: "Changing air and oil filters to ensure clean air and oil flow",
      laborFee: "₹ 250",
      itemFee: "₹ 100",
      totalAmount: "₹ 1300",
    },
    {
      id: 2,
      itemList: "Brake Check",
      description: "Inspecting brake pads, rotors, and fluid to make sure your car can stop safely when needed",
      laborFee: "₹ 300",
      itemFee: "₹ 100",
      totalAmount: "₹ 1300",
    },
  ];

  const amountData = [
    {
      serviceAmount: " ₹1700",
      subTotal: "₹ 1700",
      discount: "₹ 1300",
      CGST: "₹ 200",
      SGST: "₹ 500",
      totalAmount: "₹ 2000",
      advanceAmount: "₹ 500",
    }
  ]

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <section className="invoice-container">
      <div className="invoice-header">
        <IoMdArrowRoundBack onClick={handleBack} />
        <h5>Invoice</h5>
      </div>

      <div className="invoice-pdf">
        <div className="invoice-logo">
          <CustomLogo />
        </div>

        <Row className="invoice-details">
          {[invoiceFrom, invoiceTo].map((data, index) => (
            <Col key={index} xxl={5} xl={5} lg={5} md={5}>
              <div className="invoice-box">
                <h6>{data.title}</h6>
                <h6>{data.shopName || data.customerName}</h6>
                <p>{data.address}</p>
                {data.email && <p>{data.email}</p>}
                <p>Mobile: {data.mobile}</p>
                {data.dueDate && <p>Due Date: {data.dueDate}</p>}
              </div>
            </Col>
          ))}
        </Row>

        {/* invoice item list */}
        <div className="table-list">
          <div className="list-alignment">
            <table className="quote-table">
              <thead className="table-align">
                <tr>
                  {QuotesHeading.map((heading, index) => (
                    <th key={index} className="table-heading">
                      {heading.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {QuotesItems.map((quote, index) => (
                  <tr key={quote.id} className="list-item">
                    <td>{index + 1}</td>
                    <td>{quote.itemList}</td>
                    <td>{quote.description}</td>
                    <td>{quote.laborFee}</td>
                    <td>{quote.itemFee}</td>
                    <td>{quote.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* amount calculation */}
        {amountData.map((amount, index) => (
          <div key={index} className="amount-container">
            <h6>Total service amount : <span className="amount-value">{amount.serviceAmount}</span></h6>
            <p>Sub Total : <span className="amount-value">{amount.subTotal}</span></p>
            <p>Discount : <span className="amount-value">{amount.discount}</span></p>
            <p>CGST (7%) : <span className="amount-value">{amount.CGST}</span></p>
            <p>SGST (7%) : <span className="amount-value">{amount.SGST}</span></p>
            <h6>Total Amount : <span className="amount-value">{amount.totalAmount}</span></h6>
            <h6>Advance Amount : <span className="amount-value">{amount.advanceAmount}</span></h6>
          </div>
        ))}

      </div>
    </section >
  );
};

export default ViewInvoice;
