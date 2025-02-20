import React, { useState } from 'react';
import "./QuotesList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { ReactComponent as Norecords } from "../../../../../assets/images/advisor/no-records.svg";
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const QuotesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Cust ID" },
    { title: "Customer Name" },
    { title: "Urgency Level" },
    { title: "Appointment Date" },
    { title: "Location" },
    { title: "Status" },
    { title: "" },
  ];

  const QuotesData = [
    {
      id: 1,
      custID: "Cust_001",
      customerName: "John Doe",
      urgencyLevel: "Urgent",
      appointmentDate: "12/02/2025",
      location: "Chennai",
      status: "Accepted",
    },
    {
      id: 2,
      custID: "Cust_002",
      customerName: "John Doe",
      urgencyLevel: "Urgent",
      appointmentDate: "14/02/2025",
      location: "Chennai",
      status: "Requested",
    },
    {
      id: 3,
      custID: "Cust_001",
      customerName: "John Doe",
      urgencyLevel: "Scheduled",
      appointmentDate: "14/02/2025",
      location: "Chennai",
      status: "Rejected",
    }
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleView = (e) => {
    setIsLoading(true);
    setTotalQuotes(false)
    setTimeout(() => {
      setIsLoading(false)
      navigate("view");
    }, 500)
  };

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="quote-list">
          <h5 className="quote-heading">Quotes</h5>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service ID"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <IoSearch className="search-icon" />
              </div>

              <div className="status-wrapper">
                <div className="select-container">
                  <select
                    name="status"
                    id="status-select"
                    className="status-select"
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="">Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="requested">Requested</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="quote-table">
                <thead className="table-align">
                  <tr>
                    {tableHeadings.map((heading, index) => (
                      <th key={index} className="table-heading">
                        {heading.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {QuotesData.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Quotes Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    QuotesData.map((quote, index) => (
                      <tr key={quote.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{quote.custID}</td>
                        <td>{quote.customerName}</td>
                        <td>{quote.urgencyLevel}</td>
                        <td>{quote.appointmentDate}</td>
                        <td>{quote.location}</td>
                        <td>
                          <span className={`status ${quote.status.toLowerCase().replace(" ", "")}`}>
                            {quote.status}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={handleView}>
                            <OpenInNewOutlinedIcon />
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalQuotes.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </section>
      )}
    </>
  );
};

export default QuotesList;
