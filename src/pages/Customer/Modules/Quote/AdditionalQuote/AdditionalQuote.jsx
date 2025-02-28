import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdditionalQuote.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { FaRegEye } from "react-icons/fa6";
import ViewImageIcon from '../../../../../assets/images/customer/quotes/add-image.svg';
import { IoClose } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const AdditionalQuote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

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
      image: ViewImageIcon,
    },
    {
      id: 2,
      itemList: "Filter Replacement",
      description: "Changing air and oil filters to ensure clean air and oil flow, which improves performance and fuel efficiency",
      laborFee: "₹ 250",
      itemFee: "₹ 100",
      totalAmount: "₹ 1300",
      image: ViewImageIcon,
    },
  ];

  const handleBack = (e) => {
    e.preventDefault();
    setLoading(false);
    navigate(-1);
  };

  const handleViewImage = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
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
                  {QuotesItems.map((quote, index) => (
                    <tr key={quote.id} className="list-item">
                      <td>{index + 1}</td>
                      <td>
                        <span>{quote.itemList}</span><br />
                        <span className='view-image' onClick={() => handleViewImage(quote.image)}>
                          <FaRegEye /> View Image
                        </span>
                      </td>
                      <td>{quote.description}</td>
                      <td>{quote.laborFee}</td>
                      <td>{quote.itemFee}</td>
                      <td>
                        <span>{quote.totalAmount}</span>
                        <div className='action-container'>
                          <span className='close-icon'>
                            <IoClose />
                          </span>
                          <span className='accept-icon'>
                            <LuCheck />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
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
    </>
  );
};

export default AdditionalQuote;
