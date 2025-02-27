import React, { useState } from 'react';
import "./QuoteSummary.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import { Badge } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ChatBox from '../../../../../common/ChatBox/ChatBox';

const QuotesSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const handleReject = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(-1)
  }

  const handleAdditional = (e) => {
    e.preventDefault();
    navigate('/customer/quotes/additionalquote');
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
            <IconButton className='quotes-button' onClick={handleAdditional}>
              <Badge badgeContent={2} color="error" className='icon-badge'>
                <span>Additional Quotes</span>
              </Badge>
            </IconButton>
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

              <div className="tablebottom">
                <div className='advance-amount'>
                  <span>Advance Amount: ₹ 500</span><br />
                  {/* <span>Dear Customer, your service will begin after the advance payment.</span> */}
                </div>
                <div className='exp-date'>
                  <span>Expected Delivery Date: 22/03/2025</span>
                </div>
                <div className='total-amount'>
                  <span>Total Amount: ₹ 1700</span>
                </div>
              </div>
            </div>
          </div>

          <div className='accept-button-container'>
            <button type='submit' className='decline-button' onClick={handleReject}>Decline</button>
            <button type='submit' className='accept-button' onClick={handleSubmit}>Accept</button>
          </div>

          <ChatBox isOpen={isOpen} setIsOpen={setIsOpen} />
        </section >
      )}
    </>
  );
};

export default QuotesSummary;
