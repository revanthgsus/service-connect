import React, { useState } from 'react';
import "./QuotesList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FaRegEye } from "react-icons/fa6";
import { ReactComponent as Norecords } from "../../../../../assets/images/customer/no-records.svg"
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const QuotesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState(false);

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Urgency Level" },
    { title: "Status" },
    { title: "" },
  ];

  const QuotesData = [
    {
      id: 1,
      serviceID: "SR-12345",
      serviceType: "Car Routine Maintenance",
      appointmentDate: "12/02/2025",
      urgencyLevel: "Urgent",
      status: "Accepted",
    },
    {
      id: 2,
      serviceID: "SR-12346",
      serviceType: "Battery Testing",
      appointmentDate: "13/02/2025",
      urgencyLevel: "Standard",
      status: "Accepted",
    },
    {
      id: 3,
      serviceID: "SR-12347",
      serviceType: "Oil and filter change",
      appointmentDate: "14/02/2025",
      urgencyLevel: "Urgent",
      status: "In Progress",
    },
    {
      id: 4,
      serviceID: "SR-12348",
      serviceType: "Tire replacement",
      appointmentDate: "14/02/2025",
      urgencyLevel: "Urgent",
      status: "In Progress",
    },
    {
      id: 5,
      serviceID: "SR-12345",
      serviceType: "Car Routine Maintenance",
      appointmentDate: "16/02/2025",
      urgencyLevel: "Urgent",
      status: "Accepted",
    },
  ];

  const filteredServiceID = QuotesData.filter((quote) => {
    const matchesSearch =
      quote.serviceID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || quote.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const displayedQuotes = filteredServiceID.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("quotesummary");
    }, 1000)
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
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
                    <option value="inprogress">In Progress</option>
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
                  {displayedQuotes.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Quotes Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedQuotes.map((quote, index) => (
                      <tr key={quote.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{quote.serviceID}</td>
                        <td>{quote.serviceType}</td>
                        <td>{quote.appointmentDate}</td>
                        <td>{quote.urgencyLevel}</td>
                        <td>
                          <span className={`status ${quote.status.toLowerCase().replace(" ", "")}`}>
                            {quote.status}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={handleView}>
                            <FaRegEye />
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
                count={Math.ceil(filteredServiceID.length / itemsPerPage)}
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
