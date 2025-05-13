import React, { useCallback, useRef, useState } from 'react';
import "./SendQuote.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { HiPlus, HiMinus } from "react-icons/hi";
import WarrantyModal from '../../../../../common/WarrantyModal/WarrantyModal';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useAuth } from '../../../../../contexts/AuthContext';

const SendQuote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, appointmentId, productName, productSerialNo } = location.state || {};
  const { setShowTokenModal } = useAuth();

  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(dayjs());
  const [selectedWarrantyData, setSelectedWarrantyData] = useState(null);
  const [quoteItems, setQuoteItems] = useState([
    { itemCode: "", itemDetails: null, totalAmount: "" },  // itemDetails is a initial state
  ])

  const debounceTimers = useRef({});
  const companyName = sessionStorage.getItem("companyName");
  const [amountError, setAmountError] = useState(false);

  const QuotesHeading = [
    { title: "S.No" },
    { title: "Item Code" },
    { title: "Item Name" },
    { title: "Item Fee" },
    { title: "Labour Fee" },
    { title: "Total Amount" },
    { title: "" },
  ];


  // advanve amout limit handling
  const max_advance_amount = 100000;

  const handleAdvanceAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAdvanceAmount(value);

      if (parseFloat(value) > max_advance_amount) {
        setAmountError(true);
        setAdvanceAmount(max_advance_amount);
      } else {
        setAmountError(false);
        setAdvanceAmount(value);
      }
    }
  };


  // calculate total amount
  const calculateItemTotal = (item) => {
    const itemFee = parseFloat(item.itemFee || 0);
    const labourFee = parseFloat(item.labourFee || 0);
    return (itemFee + labourFee).toFixed(2);
  };

  // When type the itemname input field api call
  const fetchItemDetails = useCallback(async (itemCode, index) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!itemCode.trim()) return;

    const payload = {
      itemCode: itemCode,
      customerId: customerId,
      companyName: companyName,
      productName: productName,
      productSerialNo: productSerialNo,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/itemsList/getItemByItemCode`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        const data = response?.data?.item;
        const total = calculateItemTotal(data);
        setQuoteItems((prevItems) =>
          prevItems.map((item, i) =>
            i === index
              ? { ...item, itemDetails: data, totalAmount: total } : item
          )
        );
      } else {
        toast.error(response?.data?.message || "No matching item found in records.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [customerId, companyName, setShowTokenModal, productName, productSerialNo]);


  // itemcode change functionality
  const handleItemCodeChange = (index, value) => {
    setQuoteItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, itemCode: value, itemDetails: null, totalAmount: "" } : item
      )
    );
    clearTimeout(debounceTimers.current[index]);
    debounceTimers.current[index] = setTimeout(() => {
      if (value.trim() !== "") {
        fetchItemDetails(value, index);
      }
    }, 1000);
  };

  // add row plus icon
  const handleAddRow = () => {
    setQuoteItems([...quoteItems, { itemCode: "", itemDetails: null, totalAmount: "" }]);
  };

  // remove row minus icon
  const handleRemoveRow = (index) => {
    setQuoteItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // sub total calculate functionality
  const subTotal = quoteItems.reduce(
    (sum, item) => sum + parseFloat(item.totalAmount || 0), 0).toFixed(2);


  // appointment handle accept api call 
  const handleSend = async () => {
    if (!quoteItems || quoteItems.length === 0 || quoteItems.some(item => !item.itemCode.trim())) {
      toast.error("Add at least one item to send quote");
      return;
    };

    if (!appointmentId) return;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    // json from backend
    const quotationPayload = {
      appointmentId,
      advanceAmount: parseFloat(advanceAmount || 0),
      complaints: quoteItems.map(({ itemCode, itemDetails, totalAmount }) => ({
        customerId,
        itemCode,
        itemName: itemDetails?.itemName || "N/A",
        itemFee: parseFloat(itemDetails?.itemFee || 0),
        itemTax: parseFloat(itemDetails?.itemTax || 0),
        labourFee: parseFloat(itemDetails?.labourFee || 0),
        labourTax: parseFloat(itemDetails?.labourTax || 0),
        totalAmount: parseFloat(totalAmount || 0),
        warrantyStatus: itemDetails?.warrantyStatus || "No",
        purchaseDate: itemDetails?.purchaseDate || "",
        expiryDate: itemDetails?.expiryDate || "",
        warrantyPeriod: itemDetails?.warrantyPeriod || ""
      })),
      expectedDeliveryDate: expectedDeliveryDate.format("DD/MM/YYYY") || '',
      subTotal: parseFloat(subTotal || 0),
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/advisorMaster/updateAppointmentStatus/${appointmentId}/Accepted`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {

        // add quotation api call integration
        const quoteResponse = await axios.put(`${API_BASE_URL}/advisorMaster/addQuotation`,
          quotationPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (quoteResponse?.data?.status === "success") {
          toast.success("Quotes sent successfully.");
          setTimeout(() => { navigate("/advisor/quotes") }, 500);
        }
      } else {
        toast.error("Quotation already sent");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => { navigate(-1) };
  const handleCancel = () => { navigate(-1) };

  // handle view warranty modal
  const handleView = (itemDetails) => {
    setSelectedWarrantyData(itemDetails);
    setPopupOpen(true);
  };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="initial-quotes">
          <div className="quote-header">
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Send Your Quotation</h5>
            </div>
          </div>

          <div className="table-list">
            <div className="list-alignment">
              <Table className="quote-table">
                <Thead className="table-align">
                  <Tr>
                    {QuotesHeading.map((heading, index) => (
                      <Th key={index} className="table-heading">
                        {heading.title}
                      </Th>
                    ))}
                  </Tr>
                </Thead>

                <Tbody>
                  {quoteItems.map((item, index) => (
                    <Tr key={index} className="list-item" >
                      <Td>{index + 1}</Td>
                      <Td>
                        <input
                          type="text"
                          className="form-control item-input"
                          value={item.itemCode}
                          onChange={(e) => handleItemCodeChange(index, e.target.value)}
                          placeholder="Enter Item code" />

                        <span onClick={() => handleView(item.itemDetails)}
                          className={`warranty-status 
                            ${item.itemDetails?.warrantyStatus === "Warranty Covered" ? "covered"
                              : item.itemDetails?.warrantyStatus === "Expired" ? "expired"
                                : item.itemDetails?.warrantyStatus === "Claimed" ? "claimed"
                                  : item.itemDetails?.warrantyStatus === "Declined" ? "declined"
                                    : item.itemDetails?.warrantyStatus === "Already Claimed" ? "alreadyclaimed"
                                      : item.itemDetails?.warrantyStatus === "View & claim" ? "viewclaim" : ""}`}>

                          {item.itemDetails?.warrantyStatus === "No" ? ""
                            : item.itemDetails?.warrantyStatus}
                        </span>
                      </Td>

                      <Td>{item.itemDetails?.itemName || ""}</Td>
                      <Td>{item.itemDetails?.itemFee ? `₹ ${item.itemDetails.itemFee}` : ""}</Td>
                      <Td>{item.itemDetails?.labourFee ? `₹ ${item.itemDetails.labourFee}` : ""}</Td>
                      <Td>{item.totalAmount ? `₹ ${item.totalAmount}` : ""}</Td>
                      <Td>
                        {quoteItems.length > 1 && (
                          <span className='remove-icon' onClick={() => handleRemoveRow(index)} >
                            <HiMinus />
                          </span>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <button className="add-button" onClick={handleAddRow}>
                <HiPlus />
              </button>

              <div className="tablebottom">
                <div>
                  <div className="exp-date">
                    <div className="input-wrapper">
                      <div className="form-group">
                        <label>Expected Delivery Date:</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            className="form-control date-picker"
                            format="DD/MM/YYYY"
                            value={expectedDeliveryDate}
                            onChange={(newValue) => setExpectedDeliveryDate(newValue)}
                            minDate={dayjs()}
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
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>

                  <div className="advance-amount">
                    <label htmlFor="advance">Advance Amount :</label>
                    <div className="input-with-icon">
                      <span className="rupees-icon">₹</span>
                      <input
                        id="advance"
                        type='text'
                        value={advanceAmount}
                        className={`form-control enter-input${amountError ? 'input-error' : ''}`}
                        onChange={handleAdvanceAmountChange}
                      />
                    </div>

                  </div>
                  <p className="error-text"
                    style={{ visibility: amountError ? 'visible' : 'hidden' }}>
                    Maximum allowed amount is ₹ {max_advance_amount}
                  </p>
                </div>

                <div className="total-amount">
                  <label>Sub Total : </label>
                  <h5>{`₹ ${subTotal}`}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="accept-button-container">
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="accept-button" onClick={handleSend}>Send</button>
          </div>
        </section >
      )}

      <WarrantyModal
        show={popupOpen}
        handleClose={() => setPopupOpen(false)}
        warrantyData={selectedWarrantyData}
      />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        theme="light"
        hideProgressBar={true}
      />
    </>
  );
};

export default SendQuote;
