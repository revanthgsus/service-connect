import React, { useCallback, useEffect, useState } from 'react';
import "./GenerateInvoice.css";
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { IoMdArrowRoundBack } from "react-icons/io";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { useAuth } from '../../../../../contexts/AuthContext';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [cancelShow, setCancelShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [quotesItems, setQuotesItems] = useState([]); // setquotesitems data fetched when api call
  const [formValues, setFormValues] = useState({});
  const [serviceIdInput, setServiceIdInput] = useState('');

  const InvoiceData = [
    { label: "Service ID", name: "serviceId", placeholder: "Enter service Id", type: "text" },
    { label: "Customer ID", name: "customerId", placeholder: "Enter customer Id", type: "text" },
    { label: "Customer Name", name: "customerName", placeholder: "Enter customer name", type: "text" },
    { label: "Mobile Number", name: "mobileNumber", placeholder: "Enter mobile number", type: "text" },
    { label: "Email Address", name: "emailAddress", placeholder: "Enter email address", type: "email" },
    { label: "Address", name: "addressLine1", placeholder: "Enter address", type: "text" },
    { label: "Discount %", name: "discount", placeholder: "Enter discount", type: "text" },
    { label: "Due Date", name: "dueDate", placeholder: "Enter date", type: "text" },
  ];

  const complaintsHeading = [
    { title: "S.No" },
    { title: "Item Code" },
    { title: "Item Name" },
    { title: "Quantity" },
    { title: "Labour Fee" },
    { title: "Tax" },
    { title: "Tax Amount" },
    { title: "Item Fee" },
    { title: "Tax" },
    { title: "Tax Amount" },
    { title: "Row Total" },
  ];


  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // fetch invoice details when enter service ID
  const fetchInvoiceDetails = useCallback(async (serviceId) => {
    if (!serviceId?.trim()) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/advisorMaster/getInvoiceDetailsByServiceId/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.status === 200 && response.data) {
        setQuotesItems(response?.data?.complaints?.map(item => ({ ...item, quantity: 1 })) || []);
        setFormValues(response?.data || {});
      } else {
        toast.error("Failed to fetch service details");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [setShowTokenModal]);


  useEffect(() => {
    const handler = setTimeout(() => {
      if (serviceIdInput.trim()) {
        fetchInvoiceDetails(serviceIdInput);
      } else {
        setQuotesItems([]);
        setFormValues('');
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [serviceIdInput, fetchInvoiceDetails]);


  // calculate discount amount
  const handleDiscountChange = (e) => {
    let validDiscount = e.target.value.replace(/[^0-9]/g, '');
    if (parseInt(validDiscount) > 100) { validDiscount = '100' };

    const discountPercentage = parseInt(validDiscount);

    setFormValues((prev) => ({
      ...prev,
      discount: validDiscount,
      discountAmount: !isNaN(discountPercentage) ?
        ((calculateSubTotal * discountPercentage) / 100).toFixed(2) : '0.00',
    }));
  };


  // handle change quantity functionality
  const handleQuantityChange = async (index, value) => {
    const validValue = value.replace(/[^0-9]/g, '');
    if (validValue.length > 2) return;

    const quantity = parseInt(validValue || '1', 10);
    const updatedQuotes = [...quotesItems];

    updatedQuotes[index].quantity = validValue;

    const baseItemFee = parseFloat(updatedQuotes[index].baseItemFee ?? updatedQuotes[index].itemFee ?? 0);

    if (!updatedQuotes[index].baseItemFee) {
      updatedQuotes[index].baseItemFee = baseItemFee;
    }

    const itemFee = baseItemFee * quantity;
    updatedQuotes[index].itemFee = itemFee;

    const itemTax = parseFloat(updatedQuotes[index].itemTax || 0);

    const itemTaxableAmount = (itemFee * itemTax) / 100;
    updatedQuotes[index].itemTaxableAmount = itemTaxableAmount;

    const labourFee = updatedQuotes[index].labourFee
    const labourTaxableAmount = updatedQuotes[index].labourTaxableAmount;

    updatedQuotes[index].totalAmount = (itemFee + itemTaxableAmount + labourFee + labourTaxableAmount);

    setQuotesItems(updatedQuotes);
  };

  const calculateSubTotal = quotesItems.reduce((acc, item) => {
    const itemFee = parseFloat(item.itemFee || 0);
    const itemTaxableAmount = parseFloat(item.itemTaxableAmount || 0);
    const labourFee = parseFloat(item.labourFee || 0);
    const labourTaxableAmount = parseFloat(item.labourTaxableAmount || 0);

    const rowTotal = itemFee + itemTaxableAmount + labourFee + labourTaxableAmount;
    return acc + rowTotal;
  }, 0);



  // calculate the table bottom data
  const labourTaxTotal = quotesItems.reduce(
    (acc, item) => acc + (parseFloat(item.labourTaxableAmount) || 0), 0);
  const itemTaxTotal = quotesItems.reduce(
    (acc, item) => acc + (parseFloat(item.itemTaxableAmount) || 0), 0);
  const totalTax = labourTaxTotal + itemTaxTotal;

  const cgstAmount = totalTax / 2;
  const sgstAmount = totalTax / 2;

  const discountedSubTotal = calculateSubTotal - (parseFloat(formValues.discountAmount) || 0);
  const advanceAmount = parseFloat(formValues.advanceAmount) || 0;
  const balanceDueAmount = discountedSubTotal - advanceAmount;


  // generate invoice api call
  const handleGenerate = async () => {

    const userId = sessionStorage.getItem('userId');
    const companyName = sessionStorage.getItem('companyName');
    const companyLocation = sessionStorage.getItem('companyLocation');
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      serviceId: formValues.serviceId,
      customerId: formValues.customerId,
      customerName: formValues.customerName,
      mobileNumber: formValues.mobileNumber,
      emailAddress: formValues.emailAddress,
      addressLine1: formValues.addressLine1,
      addressLine2: formValues.addressLine2,
      city: formValues.city,
      pincode: formValues.pincode,
      state: formValues.state,
      companyLocation: companyLocation,
      companyName: companyName,
      productSerialNo: formValues.productSerialNo,
      advanceAmount: parseFloat(formValues.advanceAmount) || 0,
      discountPercentage: parseFloat(formValues.discount) || 0,
      discountAmount: parseFloat(formValues.discountAmount) || 0,
      dueDate: formValues.dueDate,
      advisorId: userId,
      activities: quotesItems.map(item => ({
        itemNo: item.itemCode,
        itemList: item.itemName,
        labourFee: parseFloat(item.labourFee),
        labourTax: parseFloat(item.labourTax),
        labourTaxableAmount: parseFloat(item.labourTaxableAmount).toFixed(2),
        itemFee: parseFloat(item.itemFee),
        itemTax: parseFloat(item.itemTax),
        itemTaxableAmount: parseFloat(item.itemTaxableAmount).toFixed(2),
        quantity: parseInt(item.quantity),
        rowTotal: parseFloat(item.totalAmount)
      })),
      cgst: cgstAmount.toFixed(2),
      sgst: sgstAmount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      labourTax: labourTaxTotal.toFixed(2),
      itemTax: itemTaxTotal.toFixed(2),
      subTotal: calculateSubTotal.toFixed(2),
      totalAmount: discountedSubTotal.toFixed(2),
      dueAmount: balanceDueAmount.toFixed(2),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/advisorMaster/generateInvoice`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // responseType: 'blob'
        });

      if (response?.data?.status === "success") {
        // const file = new Blob([response.data], { type: 'application/pdf' });
        // const fileURL = URL.createObjectURL(file);

        toast.success("Invoice generated successfully!");
        setTimeout(() => {
          navigate('/advisor/invoice/viewinvoice', {
            state: {
              // pdfUrl: fileURL,
              invoiceDetails: response.data
            }
          });
        }, 1000);
      } else {
        toast.error(response?.data?.message || "Failed to generate invoice.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => { setCancelShow(true) };
  const handleCancelClose = () => { setCancelShow(false) };
  const handleBack = () => { setCancelShow(true) };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="generate-invoice">
          <div className="generate-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Add New Invoice</h5>
          </div>

          <form>
            {/* generate invoice input fields */}
            <div className="generate-form">
              <h5 className="addinvoice-heading">Invoice Details</h5>
              <Row className="add-fields">
                {InvoiceData.map((field, index) => (
                  <Col key={index} xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label htmlFor={field.name}>{field.label}</label>
                        {field.name === "dueDate" ? (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker className="form-control date-picker"
                              value={formValues.dueDate ? dayjs(formValues.dueDate, 'DD/MM/YYYY') : null}
                              format="DD/MM/YYYY"
                              minDate={dayjs()}
                              onChange={(date) => {
                                const formattedDate = date ? date.format("DD/MM/YYYY") : '';
                                setFormValues(prev => ({ ...prev, dueDate: formattedDate }));
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  outline: "0",
                                  fontSize: "10px",
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
                            value={field.name === 'serviceId' ? serviceIdInput : (formValues[field.name] || '')}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (field.name === 'serviceId') {
                                setServiceIdInput(value);
                              } else if (field.name === 'discount') {
                                handleDiscountChange(e);
                              } else {
                                handleChange();
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {quotesItems.length > 0 && (
              <div className="table-list mt-5">
                <div className="list-alignment">
                  <table className="quote-table">
                    <thead className="table-align">
                      <tr>
                        {complaintsHeading.map((heading, index) => (
                          <th key={index} className="table-heading">
                            {heading.title}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {quotesItems.map((quote, index) => (
                        <tr key={quote.id} className="list-item">
                          <td>{index + 1}</td>
                          <td>{quote.itemCode}</td>
                          <td>{quote.itemName}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control quantity-input"
                              value={quote.quantity}
                              onChange={(e) => handleQuantityChange(index, e.target.value)}
                            />
                          </td>
                          <td>{`₹ ${quote.labourFee}`}</td>
                          <td>{`${quote.labourTax}%`}</td>
                          <td>{`₹ ${quote.labourTaxableAmount?.toFixed(2)}`}</td>
                          <td>{`₹ ${quote.itemFee}`}</td>
                          <td>{`${quote.itemTax}%`}</td>
                          <td>{`₹ ${quote.itemTaxableAmount?.toFixed(2)}`}</td>

                          <td>{`₹ ${(quote.itemFee + quote.itemTaxableAmount + quote.labourFee + quote.labourTaxableAmount).toFixed(2)}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {quotesItems.length > 0 && (
              <div className="tablebottom">
                <Row>
                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="tax-container">
                      <div className="summary-container">
                        <h6>Labour Tax:</h6>
                        <span>{`₹ ${labourTaxTotal.toFixed(2)}`}</span>
                      </div>
                      <div className="summary-container">
                        <h6>Item Tax:</h6>
                        <span>{`₹ ${itemTaxTotal.toFixed(2)}`}</span>
                      </div>
                      <div className="summary-container">
                        <h6>Total Tax:</h6>
                        <span>{`₹ ${totalTax.toFixed(2)}`}</span>
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="tax-container">
                      <div className="summary-container">
                        <h6>CGST:</h6>
                        <span>{`₹ ${cgstAmount.toFixed(2)}`}</span>
                      </div>
                      <div className="summary-container">
                        <h6>SGST:</h6>
                        <span>{`₹ ${sgstAmount.toFixed(2)}`}</span>
                      </div>
                    </div>
                  </Col>

                  <Col xxl={4} xl={4} lg={4} md={6} sm={6}>
                    <div className="tax-container total-amount-container">
                      <div className="summary-container">
                        <h6>Sub Total :
                          <span>{`₹ ${calculateSubTotal.toFixed(2)}`}</span>
                        </h6>
                      </div>

                      <div className="summary-container">
                        <h6>Discount ({formValues.discount}%) :
                          <span>{`₹ ${formValues.discountAmount || '0.00'}`}</span>
                        </h6>
                      </div>

                      <div className="summary-container">
                        <h6>Total Amount :
                          <span>{`₹ ${discountedSubTotal.toFixed(2)}`}</span>
                        </h6>
                      </div>

                      {parseFloat(formValues.advanceAmount) > 0 && (
                        <div className="summary-container">
                          <h6>Advance Paid :
                            <span>{`₹ ${formValues.advanceAmount || '0'}`}</span>
                          </h6>
                        </div>
                      )}

                      <div className="summary-container balace-dueamount">
                        <h6>Balance Due Amout :
                          <span>{`₹ ${balanceDueAmount.toFixed(2)}`}</span>
                        </h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </form>

          <div className="form-submit-button">
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="generate-button" onClick={handleGenerate}>Generate</button>
          </div>
        </section >
      )}

      <CancelModal
        cancelShow={cancelShow}
        handleCancelClose={handleCancelClose} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default GenerateInvoice;
