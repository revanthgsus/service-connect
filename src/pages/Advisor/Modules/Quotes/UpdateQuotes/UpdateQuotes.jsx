import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./UpdateQuotes.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import { HiPlus, HiMinus } from "react-icons/hi";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import WarrantyModal from '../../../../../common/WarrantyModal/WarrantyModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import ChatBox from '../../../../../components/ChatBox/ChatBox';
import API_BASE_URL from '../../../../../services/AuthService';
import { useAuth } from '../../../../../contexts/AuthContext';
import dayjs from 'dayjs';

const UpdateQuotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quotesData } = location.state || {};
  const { setShowTokenModal } = useAuth();

  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(dayjs());
  const [quoteItems, setQuoteItems] = useState([]);
  const [selectedWarrantyData, setSelectedWarrantyData] = useState(null);

  const debounceTimers = useRef({});

  useEffect(() => {
    if (quotesData?.data?.complaints) {
      const updatedItems = quotesData.data.complaints.map((item) => ({
        ...item,
        itemDetails: null,
        subTotal: "",
      }));
      setQuoteItems(updatedItems);

      const deliveryDate = quotesData.data.expectedDeliveryDate;
      if (deliveryDate) {
        setExpectedDeliveryDate(dayjs(deliveryDate, "DD/MM/YYYY"));
      }

      const advance = quotesData.data.advanceAmount;
      if (advance) {
        setAdvanceAmount(advance.toString());
      }
      setLoading(false);
    }
  }, [quotesData]);


  // itemcode change functionality
  const handleItemCodeChange = (index, value) => {
    setQuoteItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, itemCode: value, itemDetails: null, subTotal: "" } : item
      )
    );
    clearTimeout(debounceTimers.current[index]);
    debounceTimers.current[index] = setTimeout(() => {
      if (value.trim() !== "") {
        fetchItemDetails(value, index);
      }
    }, 1000);
  };

  // calculate total amount
  const calculateItemTotal = (item) => {
    const itemFee = parseFloat(item.itemFee || 0);
    const labourFee = parseFloat(item.labourFee || 0);
    return (itemFee + labourFee).toFixed(2);
  };

  // When type the itemname input field api call
  const fetchItemDetails = useCallback(async (itemCode, index) => {
    const customerId = quotesData?.data?.complaints[0]?.customerId;
    const companyName = quotesData?.data?.companyName;

    const productName = quotesData?.data?.complaints[0].productName;
    const productSerialNo = quotesData?.data?.complaints[0].productSerialNo;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!token || !itemCode || !customerId || !companyName) return;

    const payload = {
      itemCode: itemCode,
      customerId: customerId,
      companyName: companyName,
      productName: productName,
      productSerialNo: productSerialNo,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/itemsList/getItemByItemCode`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        const data = response?.data?.item;
        const total = parseFloat(calculateItemTotal(data) || 0);

        setQuoteItems((prevItems) =>
          prevItems.map((item, i) =>
            i === index
              ? {
                ...item,
                itemDetails: data,
                itemName: data?.itemName || "", // overwrite with fetched name
                itemFee: data.itemFee || "0",
                labourFee: data.labourFee || "0",
                totalAmount: total.toFixed(2) || "",
                warrantyStatus: data?.warrantyStatus || "No",
                subTotal: total.toFixed(2),
              }
              : item
          )
        );
      } else {
        toast.error("No matching item found in records.");
        setQuoteItems(prev =>
          prev.map((item, i) =>
            i === index
              ? { itemCode: item.itemCode, itemDetails: null, itemName: "", itemFee: "", labourFee: "", totalAmount: "", subTotal: "" }
              : item
          )
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [quotesData, setShowTokenModal]);


  // fetch item details api call
  const fetchQuoteItems = useCallback(async () => {
    const appointmentId = quotesData?.data?.complaints[0]?.appointmentId;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/advisorMaster/viewComplaintsByAppointmentId/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        const complaints = response.data.data.complaints.map((item) => ({
          ...item,
          itemDetails: null,
          subTotal: "",
        }));
        setQuoteItems(complaints);
      } else {
        toast.error("Failed to fetch complaints.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  }, [setShowTokenModal, quotesData]);


  useEffect(() => {
    fetchQuoteItems();
  }, [fetchQuoteItems]);


  // handle remove row minus icon
  const handleRemoveRow = async (index) => {
    const complaintId = quotesData?.data?.complaints[index]?.complaintId;

    if (!complaintId) return;

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/advisorMaster/deleteComplaintById/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === "success") {
        fetchQuoteItems();
      } else {
        toast.error(response?.data?.message || "Failed to delete complaint.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again");
    }
  };


  // update button api call
  const handleUpdate = async () => {
    if (!quoteItems || quoteItems.length === 0) {
      toast.error("Add at least one item to update");
      return;
    }

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      return;
    }

    const customerId = quotesData?.data?.complaints[0]?.customerId;
    const appointmentId = quotesData?.data?.complaints[0]?.appointmentId;

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
      const response = await axios.put(`${API_BASE_URL}/advisorMaster/updateQuotation`,
        quotationPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Quotation updated successfully");
        setTimeout(() => { navigate(-1) }, 500);
      } else {
        toast.error(response?.data?.message || "Failed to Update quotation.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // add row plus icon
  const handleAddRow = () => {
    setQuoteItems([...quoteItems, { itemCode: "", itemDetails: null, totalAmount: "" }]);
  };

  // sub total calculate functionality
  const subTotal = quoteItems.reduce(
    (sum, item) => sum + parseFloat(item.totalAmount || 0), 0).toFixed(2);


  // handle view warranty modal
  const handleView = (itemDetails) => {
    setSelectedWarrantyData(itemDetails);
    setPopupOpen(true);
  };

  const handleBack = () => { navigate(-1) };
  const handleCancel = () => { navigate(-1) };

  return (
    <>
      {loading && <PreLoader />}
      {!loading && (
        <section className="update-quotes">
          <div className='quote-header'>
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Quotes Summary</h5>
            </div>
          </div>

          <div className="table-list">
            <div className="list-alignment">
              <Table className="quote-table">
                <Thead className="table-align">
                  <Tr>
                    <Th className="table-heading">S.No</Th>
                    <Th className="table-heading">Item Code</Th>
                    <Th className="table-heading">Item Name</Th>
                    <Th className="table-heading">Item Fee</Th>
                    <Th className="table-heading">Labour Fee</Th>
                    <Th className="table-heading">Total Amount</Th>
                    <Th className="table-heading"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {quoteItems.map((item, index) => (
                    <Tr key={index} className="list-item">
                      <Td>{index + 1}</Td>
                      <Td>
                        <input
                          type="text"
                          className="form-control item-input"
                          value={item.itemCode}
                          onChange={(e) => handleItemCodeChange(index, e.target.value)}
                          placeholder="Enter Item code" />

                        <span onClick={() => handleView(item)}
                          className={`warranty-status 
                            ${item.warrantyStatus === "Warranty Covered" ? "covered"
                              : item.warrantyStatus === "Expired" ? "expired"
                                : item.warrantyStatus === "Claimed" ? "claimed"
                                  : item.warrantyStatus === "Declined" ? "declined"
                                    : item.warrantyStatus === "Already Claimed" ? "alreadyclaimed"
                                      : item.warrantyStatus === "View & claim" ? "viewclaim" : ""}`}>

                          {item.warrantyStatus === "No" ? ""
                            : item.warrantyStatus}
                        </span>
                      </Td>
                      <Td>{item.itemName || ''}</Td>
                      <Td>{item?.itemFee ? `₹ ${item?.itemFee}` : ""}</Td>
                      <Td>{item?.labourFee ? `₹ ${item?.labourFee}` : ""}</Td>
                      <Td>{item?.totalAmount ? `₹ ${item?.totalAmount}` : ""}</Td>
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


                <div className='advance-amount'>
                  <label>Advance Amount : </label>
                  <div className="input-with-icon">
                    <span className="rupees-icon">₹</span>
                    <input
                      id="advance"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={advanceAmount}
                      className="form-control"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setAdvanceAmount(value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="total-amount">
                  <label>Sub Total : </label>
                  <h5>{`₹ ${subTotal}`}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className='update-button-container'>
            <button type='button' className='cancel-button' onClick={handleCancel}>Cancel</button>
            <button type='button' className='update-button' onClick={handleUpdate}>Update</button>
          </div>

          <ChatBox />
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

export default UpdateQuotes;
