import React, { useEffect, useState } from 'react';
import "./QuoteSummary.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table';
import { Badge, IconButton } from '@mui/material';
import WarrantyModal from '../../common/WarrantyModal/WarrantyModal';
import PreLoader from '../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';
import ChatBox from '../../components/ChatBox/ChatBox';

const QuoteSummary = ({ apiUrl, tableHeadings, renderRow }) => {
  const { setShowTokenModal, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { quotesData } = location.state || {};

  const [quoteItems, setQuoteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedWarrantyData, setSelectedWarrantyData] = useState(null);
  const [additionalQuotes, setAdditionalQuotes] = useState([]);

  // fetch complaints data from quotes list
  useEffect(() => {
    if (quotesData?.data?.complaints) {
      setQuoteItems(quotesData.data.complaints);
      setLoading(false);
    }
  }, [quotesData]);

  const serviceId = quotesData?.data?.serviceId;

  const handleBack = () => { navigate(-1) };

  const handleView = (itemDetails) => {
    setSelectedWarrantyData(itemDetails);
    setPopupOpen(true);
  };

  const handleQuoteStatus = async (status) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const appointmentId = quotesData?.data?.complaints[0]?.appointmentId;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/${apiUrl}/${appointmentId}/${status}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        // toast.success(`Quote ${status.toLowerCase()} successfully!`);
        navigate(-1);
      } else {
        toast.error(`Quote already ${status.toLowerCase()}.`)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  };

  const handleUpdateWarrantyStatus = (updatedComplaints) => {
    setQuoteItems([...updatedComplaints]);
  };

  const handleActivity = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const appointmentId = quotesData?.data?.complaints[0]?.appointmentId;

    if (!appointmentId) {
      toast.error("Invalid appointment ID");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/advisorMaster/moveToActivity/${appointmentId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

      if (response?.data?.success === true) {
        toast.success("Moved to activity successfully!");
        setTimeout(() => { (navigate("/advisor/activity")) }, 1000);
      } else {
        toast.error("Failed to move to activity.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    }
  };


  useEffect(() => {
    const fetchAdditionalQuotes = async () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setShowTokenModal(true);
        return;
      }

      const appointmentId = quotesData?.data?.complaints?.[0]?.appointmentId;
      if (!appointmentId) {
        toast.error("Appointment ID not found.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/customerMaster/getAdditionalQuotes/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.status === 200) {
          setAdditionalQuotes(response.data.quotes);
        }
      } catch {
        toast.error("Something went wrong. Please try again later.");
      }
    };

    fetchAdditionalQuotes();
  }, [quotesData, setShowTokenModal]);

  const handleAdditional = (e) => {
    e.preventDefault()
    navigate('/customer/quotes/additionalquote', {
      state: { additionalQuotes, quotesData }
    });
  };

  return (
    <>
      {loading && <PreLoader />}
      {!loading && (
        <section className="quote-summary">
          <div className='quote-header'>
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Quotes Summary</h5>
            </div>

            {user?.role === "Customer" && additionalQuotes?.length > 0 && (
              <IconButton className='quotes-button' onClick={handleAdditional}>
                <Badge badgeContent={additionalQuotes.length} color="error" className='icon-badge'>
                  <span>Additional Quotes</span>
                </Badge>
              </IconButton>
            )}

            {user?.role === "Advisor" && quotesData?.data?.quoteStatus === "Accepted" && (
              <button type="button" className="activity-button" onClick={handleActivity}>
                Move to activity
              </button>
            )}
          </div>

          <div className="table-list">
            <div className="list-alignment">
              <Table className="quote-table">
                <Thead className="table-align">
                  <Tr>
                    {Array.isArray(tableHeadings) &&
                      tableHeadings.map((heading, index) => (
                        <Th key={index} className="table-heading">{heading.title}</Th>
                      ))
                    }
                  </Tr>
                </Thead>

                <Tbody>
                  {quoteItems.map((quote, index) => (
                    renderRow(quote, index, handleView, quotesData?.data?.quoteStatus)
                  ))}
                </Tbody>
              </Table>

              <div className="tablebottom">
                <div>
                  <div className='exp-date'>
                    <label>Expected Delivery Date :</label>
                    <span>{quotesData?.data?.expectedDeliveryDate || '-'}</span>
                  </div>

                  {quotesData?.data?.advanceAmount > 0 && (
                    <div className='advance-amount'>
                      <label>Advance Amount : </label>
                      <span>₹ {quotesData?.data?.advanceAmount || '0'}</span><br />

                      {user?.role === "Customer" && (
                        <span className='note-point'>
                          * Dear Customer, your service will begin after the advance payment
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className='total-amount'>
                  <label>Sub Total :</label>
                  <span>₹ {quotesData?.data?.subTotal || 0}</span><br />

                  {user?.role === "Customer" && (
                    <span className='tax-note'>( *Taxes will be added)</span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {user?.role === "Customer" && quotesData?.data?.quoteStatus === "Unconfirmed" && (
            <div className='accept-button-container'>
              <button
                type='button'
                className='decline-button'
                onClick={() => handleQuoteStatus("Rejected")}>Reject</button>
              <button
                type='submit'
                className='accept-button'
                onClick={() => handleQuoteStatus("Accepted")}>Accept</button>
            </div>
          )}

          <ChatBox serviceId={serviceId} />
        </section >
      )}

      <WarrantyModal
        show={popupOpen}
        handleClose={() => setPopupOpen(false)}
        warrantyData={selectedWarrantyData}
        onUpdateWarrantyStatus={handleUpdateWarrantyStatus}
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

export default QuoteSummary;
