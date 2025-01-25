import React, { useState } from 'react';
import "./QuoteSummary.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import { Badge } from '@mui/material';
import IconButton from '@mui/material/IconButton';

const QuotesSummary = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

    {
      id: 3,
      itemList: "Oil Change",
      description: "Replacing old engine oil with fresh oil to keep the engine running smoothly and prevent overheating or damage.",
      laborFee: "₹ 400",
      itemFee: "₹ 100",
      totalAmount: "₹ 1300",
    },
  ];

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  }
  const handleCancel = (e) => {
    e.preventDefault();

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(-1)
  }

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="quote-summary">
          <div className='quote-header'>
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Quotes Summary</h5>
            </div>
            <IconButton
              sx={{
                "& .MuiMuiIconButton-root": {
                  fontSize: "14px"
                }
              }}>
              <Badge badgeContent={2} color="error">
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
                <div className='exp-date'>
                  <span>Expected Delivery Date: </span>
                  <span>22/03/2025</span>
                </div>
                <div className='total-amount'>
                  <span>Total Amount :</span>
                  <span> ₹ 1700</span>
                </div>
              </div>
            </div>
          </div>

          <div className='accept-button-container'>
            <button type='submit' className='decline-button' onClick={handleCancel}>Decline</button>
            <button type='submit' className='accept-button' onClick={handleSubmit}>Accept</button>
          </div>

        </section >
      )}
    </>
  );
};

export default QuotesSummary;
