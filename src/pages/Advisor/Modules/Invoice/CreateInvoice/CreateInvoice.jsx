import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateInvoice.css";
import { Col, Row } from 'react-bootstrap';
import { IoMdArrowRoundBack } from "react-icons/io";
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import axios from 'axios';
// import dayjs from 'dayjs';
import PreLoader from '../../../../../common/PreLoader/PreLoader';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const InvoiceData = [
    {
      label: "Service ID",
      name: "serviceId",
      placeholder: "Enter service Id",
      type: "text",
    },
    {
      label: "Due Date",
      name: "dueDate",
      placeholder: "Enter due date",
      type: "date",
    },
    {
      label: "Customer Name",
      name: "customerName",
      placeholder: "Enter customer name",
      type: "text",
    },
    {
      label: "Email Address",
      name: "emailAddress",
      placeholder: "Enter email address",
      type: "email",
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      placeholder: "Enter mobile number",
      type: "text",
    },
    {
      label: "Address",
      name: "address",
      placeholder: "Enter address",
      type: "text",
    }
  ];

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
      description: "Changing air and oil filters to ensure clean air and oil flow, which improves performance and fuel efficiency",
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

  const additionalAmount = [
    { label: "Discount %", name: "discount", type: "number" },
    { label: "CGST %", name: "cgst", type: "number" },
    { label: "SGST %", name: "sgst", type: "number" },
    { label: "Total amount", name: "totalamount", type: "number" },
    { label: "Advance amount", name: "advanceamount", type: "number" },
  ];

  const handleCancel = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  const handleCancelClose = () => { setCancelShow(false) };

  const handleBack = (e) => {
    e.preventDefault();
    setCancelShow(true);
  };

  const handleGenerate = (e) => {
    e.preventDefault()
    navigate(-1)
    setLoading(false)
  }
  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="create-invoice">
          <div className="create-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Add New Invoice</h5>
          </div>

          <form action="#">
            <div className="create-form">
              <h5 className="addinvoice-heading">Invoice Details</h5>
              <Row className="add-fields">
                {InvoiceData.map((field, index) => (
                  <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor={field.name}>{field.label}</label>
                        {field.name === "dueDate" ? (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker className="form-control date-picker"
                              // value={values.joiningDate ? dayjs(values.joiningDate) : null}
                              // onChange={(date) => setFieldValue("joiningDate", date || null)}
                              format='DD/MM/YYYY'
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  outline: "0",
                                  fontSize: "11px",
                                  paddingRight: "4px",
                                  "& fieldset": {
                                    border: "0px",
                                  },
                                  "& button": {
                                    padding: "5px 8px",
                                    "& svg": {
                                      width: "16px",
                                      color: "var(--input-icon-color)",
                                    },
                                  },
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "transparent",
                                },
                              }} />
                          </LocalizationProvider>
                        ) : (
                          <input
                            id={field.name}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            className="form-control"
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="table-list mt-5">
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

              <div className="tablebottom">
                <div className='total-amount'>
                  <span>Sub Total: ₹ 1700</span>
                </div>
              </div>
            </div>

            <Row className='add-fields'>
              {additionalAmount.map((field, index) => (
                <Col xxl={3} xl={3} lg={3} md={3}>
                  <div className="input-wrapper" key={index}>
                    <div className="form-group">
                      <label>{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        className="form-control"
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </form>

          <div className="form-submit-button">
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="create-button" onClick={handleGenerate}>Generate</button>
          </div>
        </section >
      )}
      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
    </>
  );
};

export default CreateInvoice;
