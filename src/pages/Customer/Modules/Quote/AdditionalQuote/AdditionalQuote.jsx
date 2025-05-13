import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdditionalQuote.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { FaRegEye } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast, ToastContainer } from 'react-toastify';
import ChatBox from '../../../../../components/ChatBox/ChatBox';
import UPLOAD_FILE_API from '../../../../../services/UploadFile';
import { useAuth } from '../../../../../contexts/AuthContext';
import API_BASE_URL from '../../../../../services/AuthService';
import axios from 'axios';

const AdditionalQuote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowTokenModal } = useAuth();
  const { quotesData } = location.state || {};
  const additionalQuotes = location.state?.additionalQuotes ?? [];
  const serviceId = quotesData?.data?.serviceId;

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const QuotesHeading = [
    { title: "S.No" },
    { title: "Item Code" },
    { title: "Description" },
    { title: "Labour Fee" },
    { title: "Item Fee" },
    { title: "Total Amount" },
  ];


  const handleBack = (e) => {
    e.preventDefault();
    setLoading(false);
    navigate(-1);
  };

  const handleViewImage = (imageId) => {
    const imageUrl = `${UPLOAD_FILE_API}/v1/view/${imageId}`;
    setCurrentImage(imageUrl);
    setIsOpen(true);
  };

  const handleUpdateStatus = async (complaintId, status) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/customerMaster/additionalQuoteValidation/${complaintId}/${status}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success(`Quotation ${status.toLowerCase()} successfully`);
        navigate(-1);
      } else {
        toast.error("Failed to update quotation status.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PreLoader />}
      {!loading && (
        <section className='additional-container'>
          <div className="add-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Additional quotes</h5>
          </div>

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
                  {Array.isArray(additionalQuotes) && additionalQuotes.length > 0 ? (
                    additionalQuotes.map((quote, index) => (
                      <tr key={quote.id || index} className="list-item">
                        <td>{index + 1}</td>
                        <td>
                          <span>{quote.itemCode}</span><br />

                          {quote.imageId && (
                            <span className="view-image" onClick={() => handleViewImage(quote.imageId)}>
                              <FaRegEye /> View Image
                            </span>
                          )}
                        </td>
                        <td>{quote.additionalInstruction || "-"}</td>
                        <td>₹ {quote.labourFee || "0"}</td>
                        <td>₹ {quote.itemFee || "0"}</td>
                        <td>
                          <span>₹ {quote.totalAmount || "0"}</span>
                          <div className='action-container'>
                            <span className='close-icon'
                              onClick={() => handleUpdateStatus(quote.complaintId, "Rejected")}>
                              <IoClose />
                            </span>
                            <span className='accept-icon'
                              onClick={() => handleUpdateStatus(quote.complaintId, "Accepted")}>
                              <LuCheck />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px 0px' }}>
                        No additional quotes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isOpen && currentImage && (
            <Lightbox
              slides={[{ src: currentImage }]}
              open={isOpen}
              close={() => setIsOpen(false)}
            />
          )}
        </section>
      )}

      <ChatBox serviceId={serviceId} />

      <ToastContainer
        position="top-center"
        autoClose={1000}
        theme="light"
        hideProgressBar={true}
      />
    </>
  );
};

export default AdditionalQuote;
