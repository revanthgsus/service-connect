import React, { useState } from 'react';
import "./TransactionList.css";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../../../assets/images/advisor/no-records.svg";
import PreLoader from '../../../../common/PreLoader/PreLoader';
import { MdOutlineFileDownload } from "react-icons/md";

const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Invoice ID" },
    { title: "Transaction ID" },
    { title: "Payment Mode" },
    { title: "Date of Payment" },
    { title: "Paid Amount" },
    { title: "" },
  ];

  const transactionData = [
    {
      id: 1,
      serviceID: "SR-25686",
      invoiceID: "INV-00001",
      transactionID: "U75647",
      paymentMode: "Debit Card",
      paidDate: "12/02/2025",
      paidAmount: "₹2000",
      action: "",
    },
    {
      id: 2,
      serviceID: "SR-25646",
      invoiceID: "INV-00003",
      transactionID: "U75648",
      paymentMode: "Credit Card",
      paidDate: "10/02/2025",
      paidAmount: "₹3500",
      action: "",
    },
    {
      id: 3,
      serviceID: "SR-25636",
      invoiceID: "INV-00005",
      transactionID: "U75649",
      paymentMode: "UPI",
      paidDate: "08/02/2025",
      paidAmount: "₹1500",
      action: "",
    },
  ];

  const filteredTransactions = transactionData.filter((transaction) => {
    const matchesSearch = transaction.serviceID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || transaction.status.toLowerCase() === statusFilter.toLowerCase();
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

  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownload = (e) => {
    e.preventDefault();
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? <PreLoader /> : (
        <section className="transaction-list">
          <h5 className="transaction-heading">Transaction History</h5>

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
                    <option value="">Receipts</option>
                    <option value="advance">Advance</option>
                    <option value="invoice">Invoice</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="transaction-table">
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
                  {displayedTransactions.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Transaction Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedTransactions.map((transaction, index) => (
                      <tr key={transaction.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{transaction.serviceID}</td>
                        <td>{transaction.invoiceID}</td>
                        <td>{transaction.transactionID}</td>
                        <td>{transaction.paymentMode}</td>
                        <td>{transaction.paidDate}</td>
                        <td>{transaction.paidAmount}</td>
                        <td>
                          <span className='download-icon' onClick={handleDownload}>
                            <MdOutlineFileDownload />
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
                count={Math.ceil(filteredTransactions.length / itemsPerPage)}
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

export default TransactionList;
