import React, { useState } from 'react';
import "./SendQuote.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, ToastContainer } from 'react-toastify';

const SendQuote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [subTotal, setSubTotal] = useState("");

  const QuotesHeading = [
    { title: "S.No" },
    { title: "Item List" },
    { title: "Description" },
    { title: "Labor Fee" },
    { title: "Item Fee" },
    { title: "Total Amount" },
  ];

  const [quotesItems, setQuotesItems] = useState([
    {
      id: 1,
      itemList: "Filter Replacement",
      description:
        "Changing air and oil filters to ensure clean air and oil flow, which improves performance and fuel efficiency",
      laborFee: "",
      itemFee: "",
      totalAmount: 0,
    },
    {
      id: 2,
      itemList: "Brake Check",
      description:
        "Inspecting brake pads, rotors, and fluid to make sure your car can stop safely when needed",
      laborFee: "",
      itemFee: "",
      totalAmount: 0,
    },
  ]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleArchive = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    toast.success("Quotes sent successfully.", { autoClose: 1000, });
    setTimeout(() => {
      navigate("/advisor/appointments");
    }, 1000);
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuotes = [...quotesItems];
    updatedQuotes[index][field] = value;

    if (field === "laborFee" || field === "itemFee") {
      const laborFee = parseFloat(updatedQuotes[index].laborFee) || 0;
      const itemFee = parseFloat(updatedQuotes[index].itemFee) || 0;
      updatedQuotes[index].totalAmount = (laborFee + itemFee).toFixed(2);
    }

    setQuotesItems(updatedQuotes);

    // Update subTotal
    const newSubTotal = updatedQuotes.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount || 0),
      0
    );
    setSubTotal(newSubTotal.toFixed(2));
  };

  return (
    <>
      {loading ? (
        <PreLoader />
      ) : (
        <section className="quote-summary">
          <div className="quote-header">
            <div className="header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Send Your Quotation</h5>
            </div>
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
                  {quotesItems.map((quote, index) => (
                    <tr key={quote.id} className="list-item">
                      <td>{index + 1}</td>
                      <td>{quote.itemList}</td>
                      <td>{quote.description}</td>
                      <td>
                        <input
                          type="number"
                          value={quote.laborFee}
                          className="form-control"
                          onChange={(e) =>
                            handleInputChange(index, "laborFee", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={quote.itemFee}
                          className="form-control"
                          onChange={(e) =>
                            handleInputChange(index, "itemFee", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={`₹ ${quote.totalAmount}`}
                          className="form-control"
                          disabled
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="tablebottom">
                <div className="exp-date">
                  <div className="input-wrapper">
                    <div className="form-group">
                      <label>Expected Delivery Date:</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          className="form-control date-picker"
                          format="DD/MM/YYYY"
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
                  <label>Advance Amount </label>
                  <input
                    type="number"
                    value={advanceAmount}
                    className="form-control"
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                  />
                </div>
                <div className="total-amount">
                  <label>Sub Total </label>
                  <input
                    type="text"
                    className="form-control"
                    value={`₹ ${subTotal}`}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="accept-button-container">
            <button type="submit" className="decline-button" onClick={handleArchive}>
              Archive
            </button>
            <button type="submit" className="accept-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </section>
      )}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        theme="light"
      />
    </>
  );
};

export default SendQuote;
